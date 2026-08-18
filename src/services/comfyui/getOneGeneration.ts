import Service from '..';
import { ImageGeneration } from '../../database/entity/ImageGeneration';
import { ImageGenerationRepository } from '../../repository/imageGeneration/ImageGeneration';

class GetOneGenerationService extends Service<ImageGeneration, typeof ImageGenerationRepository> {
  constructor() {
    super(ImageGenerationRepository);
  }

  public async getOneGeneration(id: string): Promise<ImageGeneration> {
    const generation = await this.repository.findOne({
      where: { id },
      relations: ['style']
    });

    if (!generation) {
      throw new Error(`Generation ${id} not found`);
    }

    return generation;
  }
}

export default GetOneGenerationService;
