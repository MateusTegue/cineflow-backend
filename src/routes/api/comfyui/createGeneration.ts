import { FastifyPluginCallback } from "fastify";
import createController from "../../../controllers/comfyui/createGeneration";
import { createComfyUIGenerationSchema } from "../../../schemas/comfyui/comfyui";

const router: FastifyPluginCallback = (app, _, done) => {
  app.post("/", { schema: { body: createComfyUIGenerationSchema } }, createController.create);
  done();
};

export default router;
