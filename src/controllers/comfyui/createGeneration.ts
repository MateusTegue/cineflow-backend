import { Request } from "../../types/custom-handler";
import CreateGenerationService from "../../services/comfyui/createGeneration";
import { createComfyUIGenerationSchema } from "../../schemas/comfyui/comfyui";

const create = async (req: Request<{ body: typeof createComfyUIGenerationSchema }>) => {
  const data = req.body;
  const service = new CreateGenerationService();
  const generation = await service.createGeneration(data);
  return { result: { data: generation, message: "Image Generation Created and Queued successfully" } };
}

export default { create };