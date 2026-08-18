import { FastifyPluginCallback } from "fastify";
import webhookController from "../../../controllers/comfyui/webhook";
import { webhookComfyUISchema } from "../../../schemas/comfyui/comfyui";
import { paramsId } from "../../../schemas";

const router: FastifyPluginCallback = (app, _, done) => {
  app.post("/webhook/:generationId", { schema: { body: webhookComfyUISchema, params: paramsId } }, webhookController.webhook);
  done();
};

export default router;
