import express from "express";
import type { Request, Response } from "express";

const router = express.Router();


router.post("/logout", async (req: Request, res: Response) => {
    const cookies = req.headers.cookie;

    if (!cookies) {
        res.status(400).json({ message: "Aucun cookie trouvé" });
        return 
    }

    const tokenCookie = cookies.split(";").find(cookie => cookie.trim().startsWith("authToken="));

    if (!tokenCookie) {
        res.status(401).json({ message: "Pas de token trouvé" });
        return 
    }

    res.setHeader("Set-Cookie", "authToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict");

    res.status(200).json({ message: "Déconnexion réussie" });
    return
});

export default router;
