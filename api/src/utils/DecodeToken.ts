import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";

export function decodeToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY as jwt.Secret) as { email?: string };
    return decoded.email ?? null;
  } catch (error) {
    return null;
  }
}