import { FastifyPluginCallback } from "fastify";
import deleteImageController from "../../../controllers/comfyui/deleteImage";
import { paramsId } from "../../../schemas";

const router: FastifyPluginCallback = (app, _, done) => {
    app.delete("/:id", { schema: { params: paramsId } }, deleteImageController.deleteImage);
    done();
}
export default router;