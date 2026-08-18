import { FastifyPluginCallback } from 'fastify'
import createController from '../../../controllers/user/updateUser'
import { updateUserSchema } from '../../../schemas/user/updateSchemas'
import { paramsId } from '../../../schemas'

const router: FastifyPluginCallback = (app, _, done) => {
  app.put('/:id', { schema: { body: updateUserSchema, params: paramsId } }, createController.update)
  done()
}
export default router;