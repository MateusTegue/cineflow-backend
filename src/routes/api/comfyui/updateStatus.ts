import { FastifyPluginCallback } from "fastify";
import updateStatusController from "../../../controllers/comfyui/updateStatus";
import { updateComfyUIStatusSchema } from "../../../schemas/comfyui/comfyui";
import { paramsId } from "../../../schemas";

const router: FastifyPluginCallback = (app, _, done) => {
  app.put("/:id/status", { schema: { body: updateComfyUIStatusSchema, params: paramsId } }, updateStatusController.updateStatus);
  done();
};

export default router;