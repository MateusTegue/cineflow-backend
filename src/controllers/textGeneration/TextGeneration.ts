import { createTextGenerationSchema } from "../../schemas/textGeneration/TextGeneration";
import TextGenerationService from "../../services/textGeneration/TextGeneration";
import { Request } from "../../types/custom-handler";


const create = async (req: Request<{ body: typeof createTextGenerationSchema }>) => {
    const data = req.body;
    const textGenerationService = new TextGenerationService();
    const textGeneration = await textGenerationService.createTextGeneration(data);
    return { result: { data: textGeneration, message: "Text Generation Created succesfully" } };
}

export default { create };