import { DeepPartial } from 'typeorm';
import { AppDataSource } from '../../database/data-source'
import { ImageGeneration } from '../../database/entity/ImageGeneration';

export const ImageGenerationRepository = AppDataSource.getRepository(ImageGeneration).extend({
  async createImageGeneration(body: DeepPartial<ImageGeneration>) {
    try {
      const imageGeneration = this.create({
        ...body,
      });
      return await this.save(imageGeneration);
    } catch (error) {
      throw new Error(`Error al crear la generación de imagen: ${error}`);
    }
  }
});