import { FastifyPluginCallback } from "fastify";
import getOneController from "../../../controllers/comfyui/getOneGeneration";

const router: FastifyPluginCallback = (app, _, done) => {
  app.get("/:id", getOneController.getOne);
  done();
};

export default router;
