import Service from '..';
import { ImageGeneration } from '../../database/entity/ImageGeneration';
import { ImageGenerationRepository } from '../../repository/imageGeneration/ImageGeneration';
import { GenerationStatus } from '../../utils/models';
import ProcessGenerationService from './processGeneration';

class CreateGenerationService extends Service<ImageGeneration, typeof ImageGenerationRepository> {
  constructor() {
    super(ImageGenerationRepository);
  }

  public async createGeneration(data: any): Promise<ImageGeneration> {
    const generation = await this.repository.createImageGeneration({
      ...data,
      status: GenerationStatus.PENDING
    });

    // Procesar asíncronamente con ComfyUI
    setImmediate(async () => {
      await ProcessGenerationService.processGeneration(generation.id);
    });

    return generation;
  }
}

export default CreateGenerationService;
