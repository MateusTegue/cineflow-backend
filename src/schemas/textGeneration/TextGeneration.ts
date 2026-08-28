import { z } from 'zod'
import { ChatRole } from '../../utils/models'

export const createTextGenerationSchema = z.object({
    prompt: z.string()
        .min(1, "El prompt es obligatorio")
        .transform((str) => str.trim()),

    conversationId: z.string()
        .max(255, "El ID de conversación debe tener máximo 255 caracteres")
        .transform((str) => str.trim())
        .optional(),

    systemPrompt: z.string()
        .transform((str) => str.trim())
        .optional(),

    model: z.string()
        .max(100, "El modelo debe tener máximo 100 caracteres")
        .transform((str) => str.trim())
        .optional(),

    role: z.nativeEnum(ChatRole)
        .optional(),

    temperature: z.number()
        .min(0, "La temperatura debe ser mayor o igual a 0")
        .max(2, "La temperatura debe ser menor o igual a 2")
        .optional(),

    maxTokens: z.number()
        .int("El número máximo de tokens debe ser un entero")
        .min(1, "El número máximo de tokens debe ser mayor a 0")
        .optional(),

    parameters: z.object({
        temperature: z.number()
            .min(0, "La temperatura debe ser mayor o igual a 0")
            .max(2, "La temperatura debe ser menor o igual a 2")
            .optional(),

        topP: z.number()
            .min(0, "topP debe ser mayor o igual a 0")
            .max(1, "topP debe ser menor o igual a 1")
            .optional(),

        maxTokens: z.number()
            .int("maxTokens debe ser un número entero")
            .min(1, "maxTokens debe ser mayor a 0")
            .optional(),

        frequencyPenalty: z.number()
            .min(-2, "frequencyPenalty debe estar entre -2 y 2")
            .max(2, "frequencyPenalty debe estar entre -2 y 2")
            .optional(),

        presencePenalty: z.number()
            .min(-2, "presencePenalty debe estar entre -2 y 2")
            .max(2, "presencePenalty debe estar entre -2 y 2")
            .optional(),

        stop: z.array(z.string())
            .optional(),
    }).passthrough().optional(),
})

export type TypeCreateTextGenerationSchema = z.infer<typeof createTextGenerationSchema>
