import Service from ".."
import { TextGeneration } from "../../database/entity/TextGeneration"
import { TextGenerationRepository } from "../../repository/textGeneration/TextGeneration"
import { TypeCreateTextGenerationSchema } from "../../schemas/textGeneration/TextGeneration"
import ProcessTextGenerationService from "./processTextGeneration"
import { GenerationStatus } from "../../utils/models"

class TextGenerationService extends Service<TextGeneration, typeof TextGenerationRepository> {
    constructor() {
        super(TextGenerationRepository)
    }
    public async createTextGeneration(data: TypeCreateTextGenerationSchema): Promise<TextGeneration> {
        const textGeneration = await this.repository.createTextGeneration({
            ...data,
            model: data.model || "qwen3vl_4b_fp8_scaled.safetensors",
            status: GenerationStatus.PENDING
        });

        try {
            // Procesar con el workflow de ComfyUI
            const completedGeneration = await ProcessTextGenerationService.processTextGeneration(textGeneration.id);
            return completedGeneration;
        } catch (error) {
            console.error("Error generating text in ComfyUI:", error);
            // Si falla la conexión directa o ComfyUI está apagado, retornamos el registro con su estado y error
            const current = await this.repository.findOne({ where: { id: textGeneration.id } });
            return current || textGeneration;
        }
    }
}

export default TextGenerationService;