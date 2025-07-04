import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET n'est pas défini dans le fichier .env");
}

if (!process.env.DB_URL){
  throw new Error("DB_URL n'est pas défini dans le fichier .env");
}

if(!process.env.REDIS_URL){
  throw new Error("REDIS_URL n'est pas défini dans le fichier .env")
}

if(!process.env.TIME_WINDOW){
  throw new Error("TIME_WINDOW n'est pas défini dans le fichier .env")
}

if(!process.env.MAX_REQUESTS){
  throw new Error("MAX_REQUEST n'est pas défini dans le fichier .env")
}

if(!process.env.NEO4J_URL){
  throw new Error("NEO4J_URL n'est pas défini dans le fichier .env" )
}

if(!process.env.NEO4J_USER){
  throw new Error("NEO4J_USER n'est pas défini dans le fichier .env")
}

if(!process.env.NEO4J_PASSWORD){
  throw new Error("NEO4J_PASSWORD n'est pas défini dans le fichier .env")
}




export const SECRET_KEY = process.env.JWT_SECRET;
export const DB_URL = process.env.DB_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const NEO4J_URL = process.env.NEO4J_URL
export const NEO4J_USER = process.env.NEO4J_USER
export const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD
export const TIME_WINDOW: number = parseInt(process.env.TIME_WINDOW as string, 10);
export const MAX_REQUESTS: number = parseInt(process.env.MAX_REQUESTS as string, 10);