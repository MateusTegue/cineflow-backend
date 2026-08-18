import { z } from "zod";


export const updatePasswordSchema = z.object({
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(100, "La contraseña debe tener máximo 100 caracteres")
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
            "La contraseña debe contener mayúscula, minúscula, número y carácter especial"),
}); 
export type TypeUpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;