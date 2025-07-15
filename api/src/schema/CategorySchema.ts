import * as z from "zod"

export const CreateCategorySchema = z.object({
    categoryName: z
    .string({ required_error: "La catégorie doit avoir un nom" })
    .nonempty("La catégorie doit avoir un nom"), 
    color: z.string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "La couleur doit être valide" })
})

export const EditCategorySchema = z.object({
    _id:z.string({ required_error: "La catégorie doit avoir un id" }),
    categoryName: z
    .string({ required_error: "La catégorie doit avoir un nom" })
    .nonempty("La catégorie doit avoir un nom"), 
    color: z.string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "La couleur doit être valide" })
})




