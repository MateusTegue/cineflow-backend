import Service from "..";
import { ImageGeneration } from "../../database/entity/ImageGeneration";
import { ImageRepository } from "../../repository/imageGeneration/deleteImage";
import { NotFoundError } from "../../helpers/exceptions-errors";


class ImageService extends Service<ImageGeneration, typeof ImageRepository> {
    constructor() {
        super(ImageRepository);
    }
    public async deleteImage(id: string): Promise<void> {
        const image = await this.repository.findOneBy({ id });
        if (image === null) throw new NotFoundError("Image not found");
        await this.repository.delete({ id });
    }
}

export default ImageService;
