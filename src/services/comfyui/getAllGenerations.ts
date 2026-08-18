import Service from '..';
import { ImageGeneration } from '../../database/entity/ImageGeneration';
import { ImageGenerationRepository } from '../../repository/imageGeneration/ImageGeneration';

class GetAllGenerationsService extends Service<ImageGeneration, typeof ImageGenerationRepository> {
  constructor() {
    super(ImageGenerationRepository);
  }

  public async getAllGenerations(): Promise<ImageGeneration[]> {
    const generations = await this.repository.find({
      relations: ['style'],
      order: { created_at: 'DESC' }
    });
    return generations;
  }
}

export default GetAllGenerationsService;
