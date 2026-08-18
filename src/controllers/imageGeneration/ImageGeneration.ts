import { createImageGenerationSchema } from "../../schemas/imageGeneration/ImageGeneration";
import ImageGenerationService from "../../services/imageGeneration/ImageGeneration";
import { Request } from "../../types/custom-handler";


const create = async (req: Request<{ body: typeof createImageGenerationSchema }>) => {
  const data = req.body;
  const imageGenerationService = new ImageGenerationService();
  const imageGeneration = await imageGenerationService.createImageGeneration(data);
  return { result: { data: imageGeneration, message: "Image Generation Created succesfully" } };
}

export default { create };