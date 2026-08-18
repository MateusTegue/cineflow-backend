import { FastifyPluginCallback } from "fastify";
import createController from "../../../controllers/imageGeneration/ImageGeneration";
import { createImageGenerationSchema } from "../../../schemas/imageGeneration/ImageGeneration";

const router: FastifyPluginCallback = (app, _, done) => {
  app.post("/", { schema: { body: createImageGenerationSchema } }, createController.create);
    done();
};

export default router;