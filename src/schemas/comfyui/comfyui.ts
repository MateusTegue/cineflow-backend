import { z } from 'zod';
import { createImageGenerationSchema } from '../imageGeneration/ImageGeneration';

// Reusing image generation schema for create, or we can just expect it from the existing endpoint
// But since the comfyUI controller has its own create, let's export it.
export const createComfyUIGenerationSchema = createImageGenerationSchema;

export const updateComfyUIStatusSchema = z.object({
  status: z.string(),
  imageUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  errorMessage: z.string().optional(),
});

export const webhookComfyUISchema = z.object({
  status: z.enum(['completed', 'failed', 'processing', 'pending', 'started']),
  imageUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  errorMessage: z.string().optional(),
  revisedPrompt: z.string().optional(),
  generationTimeMs: z.number().optional(),
});

export type TypeUpdateComfyUIStatusSchema = z.infer<typeof updateComfyUIStatusSchema>;
export type TypeWebhookComfyUISchema = z.infer<typeof webhookComfyUISchema>;
