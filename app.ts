import Fastify, { FastifyInstance } from 'fastify'
import helmet from '@fastify/helmet'
import cors from '@fastify/cors'
import compress from '@fastify/compress'
import { initDatabase } from './src/database/connection'
import { serializerCompiler, validatorCompiler, ZodTypeProvider} from 'fastify-type-provider-zod'
import { CustomError, getStatusByException } from './src/helpers/exceptions-errors'

import router from './src/routes/index'

if (process.env.ENV === 'local') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export const createServer = async (): Promise<FastifyInstance> => {
  await initDatabase()

  const server: FastifyInstance = Fastify({
    logger: true
  }).withTypeProvider<ZodTypeProvider>()

  server.register(helmet)
  server.register(cors)
  server.register(compress)

  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)

  server.get('/', async (_request, res) => {
    res.status(200).send({ message: 'Welcome to cineflow core' })
  })

  server.setErrorHandler((e, _request) => {
    const statusCode = getStatusByException(e)
    const data = e instanceof CustomError ? e.data : null
    const errors = [(e as Error).message]
    return { error: true, result: { status: statusCode, errors, data } }
  })

  server.register(router, { prefix: '/api/v1' })

  return server
}

export const startServer = async (): Promise<void> => {
  const server = await createServer()
  const port = Number(process.env.PORT ?? 3001)

  server.listen({ port, host: '0.0.0.0' }, (err, _address) => {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }
  })
}
