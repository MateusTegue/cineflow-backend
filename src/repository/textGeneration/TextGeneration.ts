import { DeepPartial } from 'typeorm';
import { AppDataSource } from '../../database/data-source'
import { TextGeneration } from '../../database/entity/TextGeneration';

export const TextGenerationRepository = AppDataSource.getRepository(TextGeneration).extend({
    async createTextGeneration(body: DeepPartial<TextGeneration>) {
        try {
            const textGeneration = this.create({
                ...body,
            });
            return await this.save(textGeneration);
        } catch (error) {
            throw new Error(`Error al crear la generación de texto: ${error}`);
        }
    }
});