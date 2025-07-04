import { z } from "zod";


export const loginSchema = z.object({
    username: z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(20, "El nombre de usuario no puede exceder los 20 caracteres"),
    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .refine((val) => /[a-z]/.test(val), "La contraseña debe contener al menos una minúscula")
        .refine((val) => /[A-Z]/.test(val), "La contraseña debe contener al menos una mayúscula")
        .refine((val) => /\d/.test(val), "La contraseña debe contener al menos un número"),
})