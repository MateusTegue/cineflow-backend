import { FastifyPluginCallback } from 'fastify'
import createController from '../../../controllers/user/getUserById'

const router: FastifyPluginCallback = (app, _, done) => {
    app.get('/:id', createController.getUserById)

    done()
}
export default router