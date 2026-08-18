import Service from '..'
import { ImageGeneration } from '../../database/entity/ImageGeneration'
import { ImageGenerationRepository } from '../../repository/imageGeneration/ImageGeneration'
import { TypeCreateImageGenerationSchema } from '../../schemas/imageGeneration/ImageGeneration'


class ImageGenerationService extends Service<ImageGeneration, typeof ImageGenerationRepository> {
  constructor() {
    super(ImageGenerationRepository)
  }
    public async createImageGeneration(data: TypeCreateImageGenerationSchema): Promise<ImageGeneration> {
        const imageGeneration = await this.repository.createImageGeneration({
            ...data
        });
        return imageGeneration;
    }
}

export default ImageGenerationService;
