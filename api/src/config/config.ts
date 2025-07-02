import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET n'est pas défini dans la variable d'environnement");
}

if (!process.env.DB_URL){
  throw new Error("DB_URL n'est pas défini dans la variable d'environnement");
}

if(!process.env.REDIS_URL){
  throw new Error("REDIS_URL n'est pas défini dans la variable d'environnement")
}

if(!process.env.TIME_WINDOW){
  throw new Error("TIME_WINDOW n'est pas défini dans la variable d'environnement")
}

if(!process.env.MAX_REQUESTS){
  throw new Error("MAW_REQUEST n'est pas défini dans la variable d'environnement")
}

export const SECRET_KEY = process.env.JWT_SECRET;
export const DB_URL = process.env.DB_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const TIME_WINDOW: number = parseInt(process.env.TIME_WINDOW as string, 10);
export const MAX_REQUESTS: number = parseInt(process.env.MAX_REQUESTS as string, 10);