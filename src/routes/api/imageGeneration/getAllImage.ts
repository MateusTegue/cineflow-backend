import { FastifyPluginCallback } from 'fastify'
import createController from '../../../controllers/imageGeneration/getAllImage'

const router: FastifyPluginCallback = (app, _, done) => {
    app.get('/', createController.getAllImage)
    done()
}

export default router