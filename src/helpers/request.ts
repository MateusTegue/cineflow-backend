import { FastifyRequest } from 'fastify'

export enum ResponseCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_AUTHORIZED = 401,
  PERMISSION_DENIED = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500
}

export type ResponseObjectData = Record<string, unknown>

type ResponseData<T = ResponseObjectData[] | ResponseObjectData | null> = T

export interface Response<T> {
  data: ResponseData<T> | null
  code: ResponseCode
  success: boolean
  message: string
  errors: string[]
}

export const http = {
  isApplicationJson: (req: FastifyRequest) => {
    const contentType = req.headers['content-type']
    return contentType === 'application/json'
  },
  error: <T>(
    data: ResponseData<T> | null = null,
    code = ResponseCode.BAD_REQUEST,
    errors: string[] = []
  ): Response<T> => ({
    data,
    message: '',
    code,
    success: false,
    errors
  }),
  response: <T>(
    data: ResponseData<T> | null = null,
    code = ResponseCode.OK,
    message = '',
    success = true
  ) => ({
    data,
    code,
    success,
    message,
    errors: []
  })
}

export const error = {
  contentTypeIsInvalid: {
    data: null,
    message: '',
    errors: ['Content-Type es inválido'],
    code: ResponseCode.BAD_REQUEST,
    success: false
  },
  authorizationHeaderDoesntExist: {
    data: null,
    message: '',
    errors: ['No autorizado. El token es requerido'],
    code: ResponseCode.NOT_AUTHORIZED,
    success: false
  },
  forbidden: {
    data: null,
    message: '',
    errors: ['Acceso denegado. El token no tiene permisos para esta acción'],
    code: ResponseCode.PERMISSION_DENIED,
    success: false
  },
  invalidToken: (message: string): Response<{ type: string }> => ({
    data: {
      type: 'invalid'
    },
    message: '',
    errors: ['No autorizado. El token no es válido', message],
    code: ResponseCode.NOT_AUTHORIZED,
    success: false
  }),
  invalidBodyToken: {
    data: null,
    message: null,
    errors: ['No autorizado. La estructura del token recibido es inválida'],
    code: ResponseCode.NOT_AUTHORIZED,
    success: false
  },
  expiredToken: {
    data: {
      type: 'expired'
    },
    message: '',
    errors: ['No autorizado. El token ya expiró'],
    code: ResponseCode.NOT_AUTHORIZED,
    success: false
  },
  apiKeyHeaderDoesntExist: {
    data: null,
    message: '',
    errors: ['No autorizado. El api-key es requerido'],
    code: ResponseCode.NOT_AUTHORIZED,
    success: false
  },
  invalidApiKey: {
    data: null,
    message: '',
    errors: ['No autorizado. El api-key no es válido'],
    code: ResponseCode.NOT_AUTHORIZED
  }
}
