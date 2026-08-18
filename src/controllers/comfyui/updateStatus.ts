import { Request } from "../../types/custom-handler";
import UpdateStatusService from "../../services/comfyui/updateStatus";
import { updateComfyUIStatusSchema } from "../../schemas/comfyui/comfyui";
import { paramsId } from "../../schemas";


const updateStatus = async (req: Request<{ params: typeof paramsId, body: typeof updateComfyUIStatusSchema }>) => {
  const { id } = req.params;
  const data = req.body;
  const generationService = new UpdateStatusService();
  const generation = await generationService.updateStatus(id, data);
  return { result: { data: generation, message: "Generation status updated successfully" } };
}

export default { updateStatus };

