import { FastifyPluginCallback } from "fastify";
import createController from "../../../controllers/user/createUser";
import { createUserSchema } from "../../../schemas/user/createSchemas";

const router: FastifyPluginCallback = (app, _, done) => {
  app.post("/", { schema: { body: createUserSchema } }, createController.create);
    done();
};

export default router;