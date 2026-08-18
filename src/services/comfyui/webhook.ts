import Service from '..';
import { ImageGeneration } from '../../database/entity/ImageGeneration';
import { ImageGenerationRepository } from '../../repository/imageGeneration/ImageGeneration';
import { GenerationStatus } from '../../utils/models';

class WebhookService extends Service<ImageGeneration, typeof ImageGenerationRepository> {
  constructor() {
    super(ImageGenerationRepository);
  }

  public async processWebhook(generationId: string, data: any): Promise<void> {
    console.log(`[Webhook] Received callback for generation ${generationId}:`, data);

    const generation = await this.repository.findOne({ where: { id: generationId } });

    if (!generation) {
      throw new Error(`Generation ${generationId} not found`);
    }

    if (data.status === 'completed') {
      generation.status = GenerationStatus.COMPLETED;
      generation.imageUrl = data.imageUrl;
      generation.thumbnailUrl = data.thumbnailUrl;
      generation.revisedPrompt = data.revisedPrompt || generation.revisedPrompt;
      generation.generationTimeMs = data.generationTimeMs;
    } else if (data.status === 'failed') {
      generation.status = GenerationStatus.FAILED;
      generation.errorMessage = data.errorMessage || 'ComfyUI processing failed';
    }

    await this.repository.save(generation);
  }
}

export default WebhookService;
