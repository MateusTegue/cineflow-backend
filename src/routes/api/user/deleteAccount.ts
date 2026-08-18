import { FastifyPluginCallback } from 'fastify'
import deleteAccountController from '../../../controllers/user/deleteAccount'
import { paramsId } from '../../../schemas'

const router: FastifyPluginCallback = (app, _, done) => {
  app.delete('/:id', { schema: { params: paramsId } }, deleteAccountController.deleteAccount)
  done()
}
export default router
