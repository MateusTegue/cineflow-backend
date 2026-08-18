import { Request } from "../../types/custom-handler";
import WebhookService from "../../services/comfyui/webhook";
import { webhookComfyUISchema } from "../../schemas/comfyui/comfyui";
import { paramsId } from "../../schemas";

const webhook = async (req: Request<{ params: typeof paramsId, body: typeof webhookComfyUISchema }>) => {
  const { id } = req.params;
  const data = req.body;
  const generationService = new WebhookService();
  await generationService.processWebhook(id, data);

  return { result: { data: null, message: "Webhook processed successfully" } };
}

export default { webhook };