import * as z from "zod"

export const DepenseSchema = z.object({
    montant: z
    .number({ message : "Le montant doit être un nombre" })
    .positive({message : "Le montant doit être positif"})
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "Le montant ne peut avoir que deux décimales au maximum",
    }),
    description: z.string({ message : "La description doit être renseigné" }),
    date:z.string({ message : "La date doit être renseigné"}),
    categoryName: z.string({ message : "La categorie doit être renseigné" }),
    tags: z.string({ message :  "tag invalide" }).optional()
})