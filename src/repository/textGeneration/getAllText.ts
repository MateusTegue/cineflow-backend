import { AppDataSource } from "../../database/data-source"
import { TextGeneration } from "../../database/entity/TextGeneration"
import { NotFoundError } from "../../helpers/exceptions-errors"


export const TextGenerationRepository = AppDataSource.getRepository(TextGeneration).extend({
    getAllText: async function (): Promise<TextGeneration[]> {
        const texts = await this.find({
            order: {
                created_at: 'DESC'
            }
        })
        if (texts.length === 0) {
            throw new NotFoundError('No texts found')
        }
        return texts
    }
})