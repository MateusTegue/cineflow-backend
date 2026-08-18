import { FastifyPluginCallback } from "fastify";
import getAllController from "../../../controllers/comfyui/getAllGenerations";

const router: FastifyPluginCallback = (app, _, done) => {
  app.get("/", getAllController.getAll);
  done();
};

export default router;
