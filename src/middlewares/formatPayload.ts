import { preSerializationHookHandler } from 'fastify'
import { http, ResponseCode } from '../helpers/request'

const formatPayload: preSerializationHookHandler = (
  _req,
  res,
  payload: any,
  done
) => {
  if (payload?.error) {
    const { status, errors, data } = payload.result
    res.status(status)
    done(null, http.error(data, status, errors))
    return
  }

  res.status(ResponseCode.OK)
  const { data, message } = payload.result
  done(null, http.response(data, ResponseCode.OK, message))
}

export default formatPayload
