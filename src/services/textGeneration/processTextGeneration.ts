import axios from "axios";
import { TextGeneration } from "../../database/entity/TextGeneration";
import { TextGenerationRepository } from "../../repository/textGeneration/TextGeneration";
import { GenerationStatus } from "../../utils/models";

export interface ComfyUITextParameters {
  prompt: string;
  clipName?: string;
  type?: string;
  device?: string;
  maxLength?: number;
  temperature?: number;
  topK?: number;
  topP?: number;
  minP?: number;
  repetitionPenalty?: number;
  seed?: number;
  presencePenalty?: number;
  thinking?: boolean;
  useDefaultTemplate?: boolean;
  image?: string;
}

export class ProcessTextGenerationService {
  private readonly comfyUrl = process.env.COMFYUI_URL || "http://127.0.0.1:8188";

  async processTextGeneration(generationId: string): Promise<TextGeneration> {
    const startTime = Date.now();
    console.log(`[ComfyUI-Text] Starting processing for generation ${generationId}`);

    const generation = await TextGenerationRepository.findOne({
      where: { id: generationId },
    });

    if (!generation) {
      throw new Error(`Generation ${generationId} not found`);
    }

    try {
      generation.status = GenerationStatus.PROCESSING;
      await TextGenerationRepository.save(generation);

      const params = this.prepareParameters(generation);
      const generatedText = await this.sendToComfyUI(params);

      generation.response = generatedText;
      generation.status = GenerationStatus.COMPLETED;
      generation.generationTimeMs = Date.now() - startTime;

      await TextGenerationRepository.save(generation);
      console.log(`[ComfyUI-Text] Generation ${generationId} completed successfully!`);

      return generation;
    } catch (error: any) {
      console.error(`[ComfyUI-Text] Error processing generation ${generationId}:`, error);
      generation.status = GenerationStatus.FAILED;
      generation.errorMessage = error?.message || "Error generating text";
      generation.generationTimeMs = Date.now() - startTime;
      await TextGenerationRepository.save(generation);
      throw error;
    }
  }

  private prepareParameters(generation: TextGeneration): ComfyUITextParameters {
    const customParams = generation.parameters || {};
    return {
      prompt: generation.prompt,
      clipName: generation.model || customParams.clipName || "qwen3vl_4b_fp8_scaled.safetensors",
      type: customParams.type || "ideogram4",
      device: customParams.device || "default",
      maxLength: generation.maxTokens || customParams.max_length || 512,
      temperature: generation.temperature ?? customParams.temperature ?? 0.7,
      topK: customParams.top_k ?? 64,
      topP: customParams.topP ?? customParams.top_p ?? 0.95,
      minP: customParams.min_p ?? 0.05,
      repetitionPenalty: customParams.repetitionPenalty ?? customParams.repetition_penalty ?? 1.05,
      seed: customParams.seed ?? Math.floor(Math.random() * 1000000),
      presencePenalty: customParams.presencePenalty ?? customParams.presence_penalty ?? 0,
      thinking: customParams.thinking ?? false,
      useDefaultTemplate: customParams.use_default_template ?? true,
      image: customParams.image || "example.png",
    };
  }

  private createWorkflow(params: ComfyUITextParameters): any {
    return {
      "5": {
        inputs: {
          clip_name: params.clipName || "qwen3vl_4b_fp8_scaled.safetensors",
          type: params.type || "ideogram4",
          device: params.device || "default",
        },
        class_type: "CLIPLoader",
        _meta: {
          title: "Cargar CLIP",
        },
      },
      "6": {
        inputs: {
          prompt: params.prompt,
          max_length: params.maxLength || 512,
          sampling_mode: "on",
          "sampling_mode.temperature": params.temperature ?? 0.7,
          "sampling_mode.top_k": params.topK ?? 64,
          "sampling_mode.top_p": params.topP ?? 0.95,
          "sampling_mode.min_p": params.minP ?? 0.05,
          "sampling_mode.repetition_penalty": params.repetitionPenalty ?? 1.05,
          "sampling_mode.seed": params.seed ?? 0,
          "sampling_mode.presence_penalty": params.presencePenalty ?? 0,
          thinking: params.thinking ?? false,
          use_default_template: params.useDefaultTemplate ?? true,
          clip: ["5", 0],
          image: ["8", 0],
        },
        class_type: "TextGenerate",
        _meta: {
          title: "TextGenerate",
        },
      },
      "7": {
        inputs: {
          source: ["6", 0],
        },
        class_type: "PreviewAny",
        _meta: {
          title: "Vista previa de cualquier",
        },
      },
      "8": {
        inputs: {
          image: params.image || "example.png",
        },
        class_type: "LoadImage",
        _meta: {
          title: "Cargar Imagen",
        },
      },
    };
  }

  private async sendToComfyUI(params: ComfyUITextParameters): Promise<string> {
    const workflow = this.createWorkflow(params);

    const response = await axios.post(
      `${this.comfyUrl}/prompt`,
      { prompt: workflow },
      { headers: { "Content-Type": "application/json" } }
    );

    const promptId = response.data.prompt_id;
    console.log(`[ComfyUI-Text] Prompt queued with ID: ${promptId}`);

    let attempts = 0;
    const maxAttempts = 120; // 120 x 2.5s = 300s (5 minutos)

    while (attempts < maxAttempts) {
      await this.sleep(2500);

      const historyResponse = await axios.get(
        `${this.comfyUrl}/history/${promptId}`
      );
      const history = historyResponse.data;

      if (history[promptId] && history[promptId].outputs) {
        const outputs = history[promptId].outputs;
        const text = this.extractGeneratedText(outputs);
        if (text !== null) {
          return text;
        }
      }

      // Chequeo si el prompt terminó con error en ComfyUI
      if (history[promptId]?.status?.status_str === "error") {
        throw new Error(
          `ComfyUI execution error: ${JSON.stringify(history[promptId]?.status)}`
        );
      }

      attempts++;
    }

    throw new Error("Timeout waiting for ComfyUI text generation");
  }

  private extractGeneratedText(outputs: any): string | null {
    if (!outputs) return null;

    for (const nodeId of ["7", "6"]) {
      const nodeOutput = outputs[nodeId];
      if (nodeOutput) {
        if (Array.isArray(nodeOutput.text) && nodeOutput.text.length > 0) {
          return nodeOutput.text.join("\n");
        }
        if (typeof nodeOutput.text === "string" && nodeOutput.text.trim()) {
          return nodeOutput.text;
        }
        if (Array.isArray(nodeOutput.string) && nodeOutput.string.length > 0) {
          return nodeOutput.string.join("\n");
        }
        if (typeof nodeOutput.string === "string" && nodeOutput.string.trim()) {
          return nodeOutput.string;
        }
      }
    }

    for (const key in outputs) {
      const out = outputs[key];
      if (!out) continue;
      for (const prop of ["text", "string", "response", "output", "result"]) {
        if (
          Array.isArray(out[prop]) &&
          out[prop].length > 0 &&
          typeof out[prop][0] === "string"
        ) {
          return out[prop].join("\n");
        }
        if (typeof out[prop] === "string" && out[prop].trim()) {
          return out[prop];
        }
      }
    }

    return null;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new ProcessTextGenerationService();
