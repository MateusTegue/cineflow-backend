import { AppDataSource } from "../../database/data-source"
import { TextGeneration } from "../../database/entity/TextGeneration"


export const TextGenerationRepository = AppDataSource.getRepository(TextGeneration).extend({
    getAllText: async function (): Promise<TextGeneration[]> {
        const texts = await this.find({
            order: {
                created_at: 'DESC'
            }
        })

        return texts
    }
})







