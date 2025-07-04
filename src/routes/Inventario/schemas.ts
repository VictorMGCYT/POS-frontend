import { z } from "zod";


export const addProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "El nombre del producto debe tener al menos 3 caracteres.")
        .max(255, "El nombre del producto no puede tener más de 255 caracteres."),
    skuCode: z
        .string()
        .trim()
        .min(3, "El código SKU debe tener al menos 3 caracteres.")
        .max(255, "El código SKU no puede tener más de 255 caracteres.")
        .regex(/^[a-z0-9_]+$/, "El código SKU solo puede contener minúsculas, números y guiones bajos."),
    unitPrice: z
        .string()
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
            message: "El precio de venta debe ser un número mayor a 0.",
        }),
    purchasePrice: z
        .string()
        .refine( val => !isNaN(Number(val)) && Number(val) > 0, {
            message: "El precio de compra debe ser un número mayor a 0.",
        }),
    stockQuantity: z
        .string()
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
            message: "La cantidad en stock debe ser un número mayor a 0.",
        }),
})