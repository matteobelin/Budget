import express from "express";
import SignUpSchema from "../../schema/SignUpSchema";
import type { Request, Response } from "express";
import type { SignUpData,SignUpDataError,SignUpDataResponse } from "../../interface/SignUpData";
import User from "../../models/User";
import { hashPassword } from "../../utils/HashPassword";
import { generateToken } from "../../utils/GenerateToken";

const router = express.Router();


router.post("/signup", async ( req: Request<SignUpData>, res: Response<SignUpDataError | SignUpDataResponse> ) => {
    const result = SignUpSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({message: "Donnée de saisis invalides"});
      return ;
    }

    const { email,password,firstname,lastname } = result.data;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "Email déjà utilisé" });
            return;
        }

         const hashedPassword = await hashPassword(password);

        const user = new User({
            firstname,
            lastname,
            email,
            password : hashedPassword
        })

        await user.save();

        const token = generateToken(user);
  
        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 12 * 60 * 60 * 1000
        });

        res.status(201).json({
            firstname: user.firstname,
            lastname: user.lastname,
        });
        return ;
    } catch {
      res.status(500).json({ message: "Erreur serveur" });
      return ;
    }
  }
);

export default router;
