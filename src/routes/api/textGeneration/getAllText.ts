import { FastifyPluginCallback } from "fastify";
import createController from "../../../controllers/textGeneration/getAllText";

const router: FastifyPluginCallback = (app, _, done) => {
    app.get('/', createController.getAllText)
    done()
}

export default router