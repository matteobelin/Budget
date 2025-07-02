import type { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/DecodeToken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = undefined;

    if (req.headers.cookie) {
        const cookies = req.headers.cookie.split(";").map(cookie => cookie.trim());
        const authTokenCookie = cookies.find(cookie => cookie.startsWith("authToken="));
        if (authTokenCookie) {
            token = authTokenCookie.split("=")[1];
        }
    }

    if (!token) {
        res.status(401).json({ message: "Pas de token" });
        return ;
    }

    const decoded = decodeToken(token);

    if (!decoded) {
        res.status(401).json({ message: "Token invalide" });
        return 
    }

    (req as any).userEmail = decoded;

    next(); 
};
