import { z } from 'zod'

export const createUserSchema = z.object({

  firstName: z.string()
    .min(3, "El primer nombre es obligatorio")
    .max(50, "El primer nombre debe tener máximo 50 caracteres")
    .transform((str) => str.trim().toLowerCase()),

  firstMiddleName: z.string()
    .min(3, "El primer apellido es obligatorio")
    .max(50, "El primer apellido debe tener máximo 50 caracteres")
    .transform((str) => str.trim().toLowerCase()),

  email: z.string()
    .email("Debe ser un email válido")
    .min(5, "El email es obligatorio")
    .max(255, "El email debe tener máximo 255 caracteres")
    .regex(/@gmail\.com$/, "Solo se permiten correos de Gmail")
    .transform((email) => email.trim().toLowerCase()),

  codePhone: z.string()
    .min(1, "El código telefónico es obligatorio")
    .max(5, "El código telefónico debe tener máximo 5 caracteres"),

  phone: z.string()
    .min(5, "El teléfono es obligatorio")
    .max(15, "El teléfono debe tener máximo 15 caracteres")
    .regex(/^[0-9]+$/, "El teléfono solo debe contener números"),

  username: z.string()
    .min(5, "El usuario debe tener al menos 3 caracteres")
    .max(20, "El usuario debe tener máximo 20 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "El usuario solo puede contener letras, números y guiones bajos")
    .transform((str) => str.trim().toLowerCase()),

  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña debe tener máximo 100 caracteres")
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, 
    "La contraseña debe contener mayúscula, minúscula, número y carácter especial"),

  
  roleId: z.string().uuid("El ID del rol debe ser un UUID válido"),

})

export type TypeCreateSchema = z.infer<typeof createUserSchema>
