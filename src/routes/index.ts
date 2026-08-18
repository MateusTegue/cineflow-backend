import { FastifyPluginCallback } from 'fastify'
import formatPayload from '../middlewares/formatPayload'

import authRouter from './api/auth/auth'

import imageGenerationRouter from './api/imageGeneration/ImageGeneration'
import getAllImageRouter from './api/imageGeneration/getAllImage'

import createUserRouter from './api/user/createUser'
import getAllUserRouter from './api/user/getAllUser'
import getUserByIdRouter from './api/user/getUserById'
import updateUserRouter from './api/user/updateUser'
import updatePasswordRouter from './api/user/updatePassword'
import deleteAccountRouter from './api/user/deleteAccount'

import createComfyUIRouter from './api/comfyui/createGeneration'
import getAllComfyUIRouter from './api/comfyui/getAllGenerations'
import getOneComfyUIRouter from './api/comfyui/getOneGeneration'
import updateComfyUIStatusRouter from './api/comfyui/updateStatus'
import webhookComfyUIRouter from './api/comfyui/webhook'

const router: FastifyPluginCallback = (app, _, done) => {
  app.addHook('preSerialization', formatPayload)
  app.get('/', () => { return { result: { data: null, message: 'Welcome to capin-core!' } }})

  app.register(authRouter, { prefix: '/auth' })

  app.register(createUserRouter, { prefix: '/user' })
  app.register(getAllUserRouter, { prefix: '/user' })
  app.register(getUserByIdRouter, { prefix: '/user' })
  app.register(updateUserRouter, { prefix: '/user' })
  app.register(updatePasswordRouter, { prefix: '/user' })
  app.register(deleteAccountRouter, { prefix: '/user' })


  app.register(imageGenerationRouter, { prefix: '/image-generation' })
  app.register(getAllImageRouter, { prefix: '/image-generation' })

  app.register(createComfyUIRouter, { prefix: '/comfyui' })
  app.register(getAllComfyUIRouter, { prefix: '/comfyui' })
  app.register(getOneComfyUIRouter, { prefix: '/comfyui' })
  app.register(updateComfyUIStatusRouter, { prefix: '/comfyui' })
  app.register(webhookComfyUIRouter, { prefix: '/comfyui' })


  done()
}

export default router
