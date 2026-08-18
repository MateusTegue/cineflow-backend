import { Request } from "../../types/custom-handler";
import GetOneGenerationService from "../../services/comfyui/getOneGeneration";
import { paramsId } from "../../schemas";

const getOne = async (req: Request<{ params: typeof paramsId }>) => {
  const imageGenerationId = req.params.id;
  const service = new GetOneGenerationService();
  const generation = await service.getOneGeneration(imageGenerationId);
  return { result: { data: generation, message: "Generation retrieved successfully" } };
}

export default { getOne };

