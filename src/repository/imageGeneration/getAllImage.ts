import { AppDataSource } from '../../database/data-source'
import { ImageGeneration } from '../../database/entity/ImageGeneration';
import { NotFoundError } from '../../helpers/exceptions-errors'

export const ImageRepository = AppDataSource.getRepository(ImageGeneration).extend({
    getAllImage: async function (): Promise<ImageGeneration[]> {
        const images = await this.find({
            order: {
                created_at: 'DESC'
            }
        })
        if (images.length === 0) {
            throw new NotFoundError('No images found')
        }
        return images
    }
})