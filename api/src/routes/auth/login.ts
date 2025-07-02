import express from "express";
import LoginSchema from "../../schema/LoginSchema";
import type { Request, Response } from "express";
import { LoginData, LoginDataError, LoginDataResponse } from "../../interface/LoginData";
import User from "../../models/User";
import { comparePassword } from "../../utils/ComparePassword";
import { generateToken } from "../../utils/GenerateToken";

const router = express.Router();


router.post("/login", async ( req: Request<LoginData>, res: Response<LoginDataError | LoginDataResponse> ) => {
    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({message: "Donnée de saisis invalides"});
      return ;
    }

    const { email,password } = result.data;

    try {
      const user = await User.findOne({ email }).exec();

      if (!user) {
        res.status(404).json({ message: "Utilisateur non trouvé" });
        return ;
      }

      const compare = await comparePassword(password,user.password)
      
      if(!compare){
        res.status(401).json({message:"Email ou Mot de passe incorrect"});
        return;
      }

      const token = generateToken(user);
  
      res.cookie('authToken', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 12 * 60 * 60 * 1000
    });

      res.status(200).json({
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
