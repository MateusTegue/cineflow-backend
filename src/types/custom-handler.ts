import {
  FastifyRequest,
  FastifySchema,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface
} from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export type Request<SchemaCompiler extends FastifySchema = FastifySchema> =
  FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    SchemaCompiler,
    ZodTypeProvider
  >

export interface CustomRequest<T extends FastifySchema = FastifySchema>
  extends Request<T> {
  userId: number
}

export interface CustomFastifyRequest extends FastifyRequest {
  userId: number
}
