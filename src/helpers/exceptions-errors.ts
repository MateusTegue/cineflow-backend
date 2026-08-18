import { ResponseCode, type ResponseObjectData } from './request'

export class CustomError extends Error {
  data: ResponseObjectData | null
  status: ResponseCode
  constructor(
    message: string,
    name: string,
    status: ResponseCode,
    data: ResponseObjectData | null = null
  ) {
    super(message)
    this.name = name
    this.status = status
    this.message = message
    this.data = data
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, data: ResponseObjectData | null = null) {
    super(message, 'BAD_REQUEST', ResponseCode.BAD_REQUEST, data)
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, data: ResponseObjectData | null = null) {
    super(message, 'NOT_FOUND', ResponseCode.NOT_FOUND, data)
  }
}

export class ServerError extends CustomError {
  constructor(message: string, data: ResponseObjectData | null = null) {
    super(message, 'SERVER_ERROR', ResponseCode.SERVER_ERROR, data)
  }
}

export class ConflictError extends CustomError {
  constructor(message: string, data: ResponseObjectData | null = null) {
    super(message, 'CONFLICT', ResponseCode.CONFLICT, data)
  }
}

export class PermissionDeniedError extends CustomError {
  constructor(message: string, data: ResponseObjectData | null = null) {
    super(message, 'PERMISSION_DENIED', ResponseCode.PERMISSION_DENIED, data)
  }
}

export class NotAuthorizedError extends CustomError {
  constructor(message: string, data: ResponseObjectData | null = null) {
    super(message, 'NOT_AUTHORIZED', ResponseCode.NOT_AUTHORIZED, data)
  }
}

export const getStatusByException = (e: unknown): ResponseCode => {
  console.log(e)
  if ((e as CustomError).status !== undefined) {
    return (e as CustomError).status
  }
  return ResponseCode.SERVER_ERROR
}
