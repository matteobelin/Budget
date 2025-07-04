import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";

export function decodeToken(token: string): { email: string; id: string } | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY as jwt.Secret) as {
      email?: string;
      _id?: string;
    };
  
    if (!decoded.email || !decoded._id) return null;

    return {
      email: decoded.email,
      id: decoded._id,
    };
  } catch (error) {
    return null;
  }
}
