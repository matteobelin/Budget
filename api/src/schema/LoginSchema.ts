import * as z from "zod"

const LoginSchema = z.object({
        email: z.string().email({ message: "Email invalide" }),
        password: z.string({ message: "Le mot de passe doit être renseigné" })
    }).required()

export default LoginSchema