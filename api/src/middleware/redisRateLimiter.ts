import { Request, Response, NextFunction } from "express";
import { TIME_WINDOW, MAX_REQUESTS } from "../config/config";
import { client } from "../dataBase/redis";

export default async function redisRateLimiter(req: Request, res: Response, next: NextFunction) {
    const key = req.ip ?? "unknown_ip";

    let requests = await client.get(key);

    if (requests == null) {
        await client.set(key, 1, { EX: TIME_WINDOW });
        return next();
    }

    if (parseInt(requests) >= MAX_REQUESTS) {
        const ttl = await client.ttl(key);
        res.status(429).json({message:`Top de requete veuillez réessayer dans ${ttl} seconde${ttl > 1 ?  "s" : ""}`});
        return
    }

    await client.incr(key);
    next();
}