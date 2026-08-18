import { z } from 'zod'
import { ImageAspectRatio, ImageQuality } from '../../utils/models'

export const createImageGenerationSchema = z.object({
    prompt: z.string()
        .min(1, "El prompt es obligatorio")
        .max(1000, "El prompt debe tener máximo 1000 caracteres")
        .transform((str) => str.trim()),

    revisedPrompt: z.string()
        .max(1000, "El prompt revisado debe tener máximo 1000 caracteres")
        .transform((str) => str.trim())
        .optional(),

    negativePrompt: z.string()
        .max(1000, "El prompt negativo debe tener máximo 1000 caracteres")
        .transform((str) => str.trim())
        .optional(),

    aspectRatio: z.nativeEnum(ImageAspectRatio)
        .optional(),

    quality: z.nativeEnum(ImageQuality)
        .optional(),

    width: z.number()
        .int("El ancho debe ser un número entero")
        .min(1, "El ancho debe ser mayor que 0")
        .max(4096, "El ancho debe ser menor o igual a 4096")
        .optional(),

    height: z.number()
        .int("La altura debe ser un número entero")
        .min(1, "La altura debe ser mayor que 0")
        .max(4096, "La altura debe ser menor o igual a 4096")
        .optional(),

    parameters: z.object({
        temperature: z.number()
            .min(0, "La temperatura debe ser mayor o igual a 0")
            .max(1, "La temperatura debe ser menor o igual a 1")
            .optional(),

        steps: z.number()
            .int("Los pasos deben ser un número entero")
            .min(1, "Los pasos deben ser mayor que 0")
            .max(100, "Los pasos deben ser menor o igual a 100")
            .optional(),

        cfgScale: z.number()
            .min(1, "El cfgScale debe ser mayor o igual a 1")
            .max(20, "El cfgScale debe ser menor o igual a 20")
            .optional(),

        seed: z.number()
            .int("La semilla debe ser un número entero")
            .optional(),

        sampler: z.string()
            .max(100, "El sampler debe tener máximo 100 caracteres")
            .transform((str) => str.trim())
            .optional(),

        model: z.string()
            .max(100, "El modelo debe tener máximo 100 caracteres")
            .transform((str) => str.trim())
            .optional(),

        negativePrompt: z.string()
            .max(1000, "El prompt negativo debe tener máximo 1000 caracteres")
            .transform((str) => str.trim())
            .optional(),
    }).optional(),
})

export type TypeCreateImageGenerationSchema = z.infer<typeof createImageGenerationSchema>