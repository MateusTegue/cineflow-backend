import axios from 'axios';
import { ImageGeneration } from '../../database/entity/ImageGeneration';
import { ImageGenerationRepository } from '../../repository/imageGeneration/ImageGeneration';
import { GenerationStatus } from '../../utils/models';

export interface ComfyUIParameters {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  steps?: number;
  cfgScale?: number;
  seed?: number;
  sampler?: string;
  model?: string;
  style?: string;
}

export class ProcessGenerationService {
  private readonly comfyUrl = process.env.COMFYUI_URL || 'http://localhost:8000';
  private readonly apiUrl = process.env.API_URL || 'http://localhost:3000';

  async processGeneration(generationId: string): Promise<void> {
    try {
      console.log(`[ComfyUI] Starting processing for generation ${generationId}`);

      const generation = await ImageGenerationRepository.findOne({
        where: { id: generationId },
      });

      if (!generation) {
        throw new Error(`Generation ${generationId} not found`);
      }

      generation.status = GenerationStatus.PROCESSING;
      await ImageGenerationRepository.save(generation);
      console.log(`[ComfyUI] Generation ${generationId} status updated to processing`);

      let stylePrompt = undefined;

      const comfyParams = this.prepareComfyUIParameters(generation, stylePrompt);
      console.log(`[ComfyUI] Parameters prepared:`, comfyParams);

      const imageUrl = await this.sendToComfyUI(comfyParams, generationId);

      generation.imageUrl = imageUrl;
      generation.status = GenerationStatus.COMPLETED;
      generation.revisedPrompt = comfyParams.prompt;

      await ImageGenerationRepository.save(generation);
      console.log(`[ComfyUI] Generation ${generationId} completed successfully!`);

      await this.notifyCompletion(generation);

    } catch (error: any) {
      console.error(`[ComfyUI] Error processing generation ${generationId}:`, error);
      await this.handleGenerationError(generationId, error);
    }
  }

  private prepareComfyUIParameters(generation: ImageGeneration, stylePrompt?: string): ComfyUIParameters {
    return {
      prompt: generation.prompt,
      negativePrompt: generation.negativePrompt || '',
      width: generation.width || 1024,
      height: generation.height || 1024,
      steps: generation.parameters?.steps || 30,
      cfgScale: generation.parameters?.cfgScale || 7.5,
      seed: generation.parameters?.seed || Math.floor(Math.random() * 1000000),
      sampler: generation.parameters?.sampler || 'DPM++ 2M Karras',
      model: generation.parameters?.model || 'sd_xl_base_v1.0.safetensors',
      style: stylePrompt
    };
  }

  private async sendToComfyUI(params: ComfyUIParameters, generationId: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.comfyUrl}/generate`,
        {
          ...params,
          generationId,
          callbackUrl: `${this.apiUrl}/api/comfyui/webhook/${generationId}`
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 300000
        }
      );

      if (response.data.imageUrl) {
        return response.data.imageUrl;
      } else {
        throw new Error('No image URL returned from ComfyUI');
      }

    } catch (error) {
      console.log('[ComfyUI] REST API failed, trying native workflow...');
      return await this.sendToComfyUINative(params, generationId);
    }
  }

  private async sendToComfyUINative(params: ComfyUIParameters, generationId: string): Promise<string> {
    const workflow = this.createWorkflow(params);
    
    const response = await axios.post(`${this.comfyUrl}/prompt`, {
      prompt: workflow
    });

    const promptId = response.data.prompt_id;
    console.log(`[ComfyUI] Prompt sent with ID: ${promptId}`);

    let attempts = 0;
    const maxAttempts = 60; 

    while (attempts < maxAttempts) {
      await this.sleep(5000); 
      
      const historyResponse = await axios.get(`${this.comfyUrl}/history/${promptId}`);
      const history = historyResponse.data;
      
      if (history[promptId] && history[promptId].outputs) {
        const outputs = history[promptId].outputs;
        for (const key in outputs) {
          if (outputs[key].images && outputs[key].images.length > 0) {
            const image = outputs[key].images[0];
            const imageUrl = `${this.comfyUrl}/view?filename=${image.filename}&type=output&subfolder=${image.subfolder || ''}`;
            return imageUrl;
          }
        }
      }
      
      attempts++;
    }

    throw new Error('Timeout waiting for ComfyUI to generate image');
  }

  private createWorkflow(params: ComfyUIParameters): any {
    return {
      "3": {
        "inputs": {
          "seed": params.seed || 0,
          "steps": params.steps || 30,
          "cfg": params.cfgScale || 7.5,
          "sampler_name": params.sampler || "DPM++ 2M Karras",
          "scheduler": "Karras",
          "denoise": 1,
          "model": ["4", 0]
        },
        "class_type": "KSampler"
      },
      "4": {
        "inputs": {
          "ckpt_name": params.model || "sd_xl_base_v1.0.safetensors"
        },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "inputs": {
          "width": params.width || 1024,
          "height": params.height || 1024,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
      },
      "6": {
        "inputs": {
          "text": params.prompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": {
          "text": params.negativePrompt || "",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode"
      },
      "9": {
        "inputs": {
          "filename_prefix": `generation_${Date.now()}`,
          "images": ["8", 0]
        },
        "class_type": "SaveImage"
      }
    };
  }

  private async handleGenerationError(generationId: string, error: any): Promise<void> {
    const generation = await ImageGenerationRepository.findOne({ where: { id: generationId } });
    if (generation) {
      generation.status = GenerationStatus.FAILED;
      await ImageGenerationRepository.save(generation);
    }
    console.error(`[ComfyUI] Generation ${generationId} failed:`, error);
  }

  private async notifyCompletion(generation: ImageGeneration): Promise<void> {
    console.log(`[ComfyUI] Generation ${generation.id} completed!`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ProcessGenerationService();
