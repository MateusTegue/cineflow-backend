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
      sampler: generation.parameters?.sampler || 'dpmpp_2m',
      model: generation.parameters?.model || 'krea2_turbo_fp8_scaled.safetensors',
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
    const maxAttempts = 300; // 300 x 5s = 1500s (~25 minutos para modelos pesados/CPU)

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
            console.log(`[ComfyUI] Image generated successfully: ${imageUrl}`);
            return imageUrl;
          }
        }
      }

      if (attempts % 6 === 0) {
        console.log(`[ComfyUI] Waiting for generation ${generationId}... (${attempts * 5}s elapsed)`);
      }

      attempts++;
    }

    throw new Error('Timeout waiting for ComfyUI to generate image');
  }

  private createWorkflow(params: ComfyUIParameters): any {
    return {
      "29": {
        "inputs": {
          "filename_prefix": `generation_${Date.now()}`,
          "images": [
            "30:8",
            0
          ]
        },
        "class_type": "SaveImage"
      },
      "30:6": {
        "inputs": {
          "text": [
            "30:28",
            0
          ],
          "clip": [
            "30:11",
            0
          ]
        },
        "class_type": "CLIPTextEncode"
      },
      "30:5": {
        "inputs": {
          "width": params.width || 1024,
          "height": params.height || 1024,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
      },
      "30:3": {
        "inputs": {
          "seed": params.seed || Math.floor(Math.random() * 1000000000),
          "steps": params.steps || 8,
          "cfg": params.cfgScale || 1,
          "sampler_name": "euler",
          "scheduler": "simple",
          "denoise": 1,
          "model": [
            "30:22",
            0
          ],
          "positive": [
            "30:6",
            0
          ],
          "negative": [
            "30:13",
            0
          ],
          "latent_image": [
            "30:5",
            0
          ]
        },
        "class_type": "KSampler"
      },
      "30:8": {
        "inputs": {
          "samples": [
            "30:3",
            0
          ],
          "vae": [
            "30:12",
            0
          ]
        },
        "class_type": "VAEDecode"
      },
      "30:10": {
        "inputs": {
          "unet_name": "krea2_turbo_fp8_scaled.safetensors",
          "weight_dtype": "default"
        },
        "class_type": "UNETLoader"
      },
      "30:11": {
        "inputs": {
          "clip_name": "qwen3vl_4b_fp8_scaled.safetensors",
          "type": "krea2",
          "device": "default"
        },
        "class_type": "CLIPLoader"
      },
      "30:12": {
        "inputs": {
          "vae_name": "qwen_image_vae.safetensors"
        },
        "class_type": "VAELoader"
      },
      "30:13": {
        "inputs": {
          "conditioning": [
            "30:6",
            0
          ]
        },
        "class_type": "ConditioningZeroOut"
      },
      "30:15": {
        "inputs": {
          "lora_name": "krea2_darkbrush.safetensors",
          "strength_model": 0.8,
          "model": [
            "30:10",
            0
          ]
        },
        "class_type": "LoraLoaderModelOnly"
      },
      "30:16": {
        "inputs": {
          "prompt": [
            "30:17",
            0
          ],
          "max_length": 512,
          "sampling_mode": "on",
          "sampling_mode.temperature": 0.7,
          "sampling_mode.top_k": 64,
          "sampling_mode.top_p": 0.95,
          "sampling_mode.min_p": 0.05,
          "sampling_mode.repetition_penalty": 1.05,
          "sampling_mode.seed": 0,
          "sampling_mode.presence_penalty": 0,
          "thinking": false,
          "use_default_template": true,
          "clip": [
            "30:11",
            0
          ]
        },
        "class_type": "TextGenerate"
      },
      "30:17": {
        "inputs": {
          "string_a": [
            "30:18",
            0
          ],
          "string_b": [
            "30:19",
            0
          ],
          "delimiter": ""
        },
        "class_type": "StringConcatenate"
      },
      "30:18": {
        "inputs": {
          "value": "You are an expert prompt engineer for text-to-image models. Your task is to expand the user's prompt into a highly effective image-generation prompt.\n\nThink step by step about the request before writing the answer:\n- What is the subject and mood?\n- What visual styles, mediums, and lighting options would fit? Consider two or three alternatives and pick the one that best serves the caption.\n- What composition, framing, and grounded details will help the text-to-image model?\n\nThen output a single expanded prompt paragraph.\n\nFollow these rules strictly:\n1. **Faithfulness First:** Preserve all original subjects, actions, colors, and spatial relationships. Do not add new objects, props, characters, or animals unless the user clearly implies them.\n2. **Practical T2I Structure:** Write a prompt that a text-to-image model can parse cleanly. Group subjects with their own attributes and actions. Use grounded phrasing for poses, interactions, and spatial layout.\n3. **Style Planning Stays Internal:** Use your internal reasoning to choose style, medium, framing, and lighting. Do not emit planning tags or wrappers in the visible answer body.\n4. **Text Rendering:** If the user requests visible text, quotes, labels, or typography, specify the exact text clearly and wrap requested words in quotes.\n5. **Avoid Over-Specification:** Do not invent highly specific clothing, colors, materials, or scene details unless the input supports them.\n6. **Structure:** Write one cohesive paragraph after the thinking block. No bullets, JSON, or markdown.\n7. **Respect Existing Detail:** If the user's prompt is already detailed, lightly polish and finalize rather than heavily expanding — preserve their phrasing and direction.\n8. **Respect the Human Form:** Treat depictions of people with dignity. Assume clothing covers genitals and intimate anatomy.\n9. **Preserve User Medium:** When the user explicitly requests a medium (e.g. \"photo of\", \"photograph of\", \"illustration of\", \"painting of\", \"sketch of\", \"3D render of\"), honor it. Do not pivot to a different medium to avoid difficulty — match the user's stated intent.\n\nUser's Input:\n\n"
        },
        "class_type": "PrimitiveStringMultiline"
      },
      "30:19": {
        "inputs": {
          "value": params.prompt
        },
        "class_type": "PrimitiveStringMultiline"
      },
      "30:20": {
        "inputs": {
          "source": [
            "30:21",
            0
          ]
        },
        "class_type": "PreviewAny"
      },
      "30:21": {
        "inputs": {
          "switch": [
            "30:24",
            0
          ],
          "on_false": [
            "30:19",
            0
          ],
          "on_true": [
            "30:16",
            0
          ]
        },
        "class_type": "ComfySwitchNode"
      },
      "30:22": {
        "inputs": {
          "switch": [
            "30:23",
            0
          ],
          "on_false": [
            "30:10",
            0
          ],
          "on_true": [
            "30:15",
            0
          ]
        },
        "class_type": "ComfySwitchNode"
      },
      "30:23": {
        "inputs": {
          "value": false
        },
        "class_type": "PrimitiveBoolean"
      },
      "30:24": {
        "inputs": {
          "value": true
        },
        "class_type": "PrimitiveBoolean"
      },
      "30:27": {
        "inputs": {
          "string_a": [
            "30:20",
            0
          ],
          "string_b": "muted minimalist sketch style",
          "delimiter": ", "
        },
        "class_type": "StringConcatenate"
      },
      "30:28": {
        "inputs": {
          "switch": [
            "30:23",
            0
          ],
          "on_false": [
            "30:20",
            0
          ],
          "on_true": [
            "30:27",
            0
          ]
        },
        "class_type": "ComfySwitchNode"
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
