import * as z from "zod"

export const CreateCategorySchema = z.object({
    categoryName: z.string({ message: "La catégorie doit avoir un nom" }),
    color: z.string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "La couleur doit être valide" })
})


