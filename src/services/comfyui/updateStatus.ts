import Service from '..';
import { ImageGeneration } from '../../database/entity/ImageGeneration';
import { ImageGenerationRepository } from '../../repository/imageGeneration/ImageGeneration';
import { GenerationStatus } from '../../utils/models';

class UpdateStatusService extends Service<ImageGeneration, typeof ImageGenerationRepository> {
  constructor() {
    super(ImageGenerationRepository);
  }

  public async updateStatus(id: string, data: any): Promise<ImageGeneration> {
    const generation = await this.repository.findOne({ where: { id } });

    if (!generation) {
      throw new Error(`Generation ${id} not found`);
    }

    generation.status = data.status as GenerationStatus;
    if (data.imageUrl) generation.imageUrl = data.imageUrl;
    if (data.thumbnailUrl) generation.thumbnailUrl = data.thumbnailUrl;
    if (data.errorMessage) generation.errorMessage = data.errorMessage;

    await this.repository.save(generation);
    return generation;
  }
}

export default UpdateStatusService;
