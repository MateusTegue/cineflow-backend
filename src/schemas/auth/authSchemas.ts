import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string()
    .email("Debe ser un email válido")
    .min(5, "El email es obligatorio")
    .max(255, "El email debe tener máximo 255 caracteres")
    .transform((email) => email.trim().toLowerCase()),

  password: z.string()
    .min(1, "La contraseña es obligatoria")
    .max(100, "La contraseña debe tener máximo 100 caracteres"),
})

export type TypeLoginSchema = z.infer<typeof loginSchema>

