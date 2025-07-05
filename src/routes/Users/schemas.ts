import { z } from "zod";


export const userShema = z.object({
    username: z.string().min(3, "El nombre de usuario debe contener al menos 3 caracteres."),
    firstName: z.string().min(3, "El nombre debe contener al menos 3 caracteres."),
    paternalSurname: z.string().min(3, "El apellido paterno debe contener al menos 3 caracteres."),
    maternalSurname: z.string().min(3, "El apellido materno debe contener al menos 3 caracteres."),
    password: z.string()
        .min(6, "La contraseña debe contener al menos 6 caracteres.")
        .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula.")
        .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
        .regex(/[0-9]/, "La contraseña debe contener al menos un número."),
    confirmPassword: z.string().min(6, "La confirmación de contraseña debe contener al menos 6 caracteres."),
    role: z.enum(["user", "admin"], {
        errorMap: () => ({ message: "El rol debe ser 'user' o 'admin'." })
    })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"],
    })


export const userEditSchema = z.object({
    id: z.string().uuid("El ID del usuario debe ser un UUID válido."),
    username: z.string().min(3, "El nombre de usuario debe contener al menos 3 caracteres."),
    firstName: z.string().min(3, "El nombre debe contener al menos 3 caracteres."),
    paternalSurname: z.string().min(3, "El apellido paterno debe contener al menos 3 caracteres."),
    maternalSurname: z.string().min(3, "El apellido materno debe contener al menos 3 caracteres."),
    role: z.enum(["user", "admin"], {
        errorMap: () => ({ message: "El rol debe ser 'user' o 'admin'." })
    })
})