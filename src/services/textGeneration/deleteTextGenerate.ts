import Service from "..";
import { TextGeneration } from "../../database/entity/TextGeneration";
import { TextGenerateRepository } from "../../repository/textGeneration/deleteTextGenerate";
import { NotFoundError } from "../../helpers/exceptions-errors";

class TextGenerateService extends Service<TextGeneration, typeof TextGenerateRepository> {
    constructor() {
        super(TextGenerateRepository);
    }

    public async deleteTextGenerate(id: string): Promise<void> {
        const textGenerate = await this.repository.findOneBy({ id });
        if (!textGenerate) {
            throw new NotFoundError(`TextGenerate with id ${id} does not exist`);
        }
        await this.repository.delete({ id });
    }
}

export default TextGenerateService;