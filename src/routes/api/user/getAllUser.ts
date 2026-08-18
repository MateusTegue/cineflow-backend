import { FastifyPluginCallback } from 'fastify'
import createController from '../../../controllers/user/getAllUser'

const router: FastifyPluginCallback = (app, _, done) => {
    app.get('/', createController.getAllUser)
    done()
}
export default router
