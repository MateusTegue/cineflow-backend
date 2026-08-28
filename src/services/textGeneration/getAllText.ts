import Service from ".."
import { TextGeneration } from "../../database/entity/TextGeneration"
import { TextGenerationRepository } from "../../repository/textGeneration/getAllText"


class TextGenerationService extends Service<TextGeneration, typeof TextGenerationRepository> {
    constructor() {
        super(TextGenerationRepository);
    }
    public async getAll(): Promise<TextGeneration[]> {
        const images = await this.repository.getAllText()

        return images
    }

}

export default TextGenerationService;