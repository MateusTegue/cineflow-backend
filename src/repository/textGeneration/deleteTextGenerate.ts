import { AppDataSource } from "../../database/data-source";
import { TextGeneration } from "../../database/entity/TextGeneration"

export const TextGenerateRepository = AppDataSource.getRepository(TextGeneration).extend({
    deleteTextGenerateById: async function (id: string): Promise<void> {
        const textGenerate = await this.findOneBy({ id });
        if (!textGenerate) {
            throw new Error(`TextGenerate with id ${id} does not exist`);
        }
        await this.delete({ id });
    },
})