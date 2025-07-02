import express from "express";
import type { Request, Response } from "express";
import User from "../models/User";
import { GetMeDataError, GetMeDataResponse } from "../interface/GetMeData";
import { authMiddleware } from "../middleware/authMiddleWare";

const router = express.Router();

router.get("/me",authMiddleware, async (req: Request, res: Response<GetMeDataError | GetMeDataResponse>) => {
        const email = (req as any).userEmail;

        const user = await User.findOne({ email }).exec();

        if (!user) {
            res.status(404).json({ message: "Aucun utilisateur trouvé" });
            return ;
        }

        res.status(200).json({
            firstname: user.firstname,
            lastname: user.lastname,
        });
        return;
    }
);

export default router;
