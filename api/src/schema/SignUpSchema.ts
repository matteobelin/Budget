import * as z from "zod"

const passwordRegex = /^(?=.*[A-Z])(?=.*\.)[A-Za-z\d.]{8,}$/;

const SignUpSchema = z.object({
        firstname:z.string({message:"Le prénom doit être renseigné"}),
        lastname:z.string({message:"Le nom de famille doit être renseigné"}),
        email: z.string().email({ message: "Email invalide" }),
        password: z.string({ message: "Le mot de passe doit être renseigné" })
                            .min(5, { message: "Le mot de passe doit contenir au moins 8 caractères" })
                            .regex(passwordRegex, { message: "Le mot de passe doit contenir au moins une majuscule et un point (.)"}),
        confirmPassword: z.string({ required_error: "Veuillez confirmer le mot de passe" }),
    })
    .refine((data) => data.password === data.confirmPassword, { message: "Les mots de passe ne correspondent pas",path: ["confirmPassword"] });

export default SignUpSchema