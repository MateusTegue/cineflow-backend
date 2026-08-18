import { FastifyPluginCallback } from 'fastify'
import authController from '../../../controllers/auth/auth'

const router: FastifyPluginCallback = (app, _, done) => {
  app.post('/', authController.login)
  done()
}
export default router



