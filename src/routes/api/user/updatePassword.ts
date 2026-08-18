import { FastifyPluginCallback } from "fastify";
import updatePasswordController from "../../../controllers/user/updatePassword";
import { updatePasswordSchema } from "../../../schemas/user/updatePassword";
import { paramsId } from "../../../schemas";

const router: FastifyPluginCallback = (app, _, done) => {
  app.patch("/:id/password",{ schema: { body: updatePasswordSchema, params: paramsId } },updatePasswordController.updatePassword);
  done();
};
export default router;