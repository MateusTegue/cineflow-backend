import Service from "..";
import { ImageGeneration } from "../../database/entity/ImageGeneration";
import { ImageRepository } from "../../repository/imageGeneration/getAllImage";


class ImageService extends Service<ImageGeneration, typeof ImageRepository> {
  constructor() {
    super(ImageRepository);
  }
    public async getAll(): Promise<ImageGeneration[]> {
    const images = await this.repository.getAllImage()

    return images
  }

}

export default ImageService;
