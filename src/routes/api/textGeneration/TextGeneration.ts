import { FastifyPluginCallback } from "fastify";
import createController from "../../../controllers/textGeneration/TextGeneration";
import { createTextGenerationSchema } from "../../../schemas/textGeneration/TextGeneration";

const router: FastifyPluginCallback = (app, _, done) => {
    app.post("/", { schema: { body: createTextGenerationSchema } }, createController.create);
    done();
};

export default router;