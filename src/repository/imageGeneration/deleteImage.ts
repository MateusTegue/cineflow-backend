import { AppDataSource } from "../../database/data-source";
import { ImageGeneration } from "../../database/entity/ImageGeneration";
import { NotFoundError } from "../../helpers/exceptions-errors";

export const ImageRepository = AppDataSource.getRepository(ImageGeneration).extend({
    deleteImageById: async function (id: string): Promise<void> {
        const image = await this.findOneBy({ id });
        if (!image) {
            throw new NotFoundError(`Image with id ${id} does not exist`);
        }
        await this.delete({ id });
    },
})