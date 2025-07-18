import * as z from "zod"

export const ConseilSchema = z.object({
    requete: z
    .string({ required_error: "La requete doit avoir une chaine de caractere" })
    .nonempty("La requete ne doit pas être vide"), 
})





