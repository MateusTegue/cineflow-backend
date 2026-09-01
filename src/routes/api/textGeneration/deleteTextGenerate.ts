import { FastifyPluginCallback } from 'fastify'
import deleteTextGenerateController from '../../../controllers/textGeneration/deleteTextGenerate'
import { paramsId } from '../../../schemas'

const router: FastifyPluginCallback = (app, _, done) => {
  app.delete('/:id', { schema: { params: paramsId } }, deleteTextGenerateController.deleteTextGenerate)
  done()
}

export default router