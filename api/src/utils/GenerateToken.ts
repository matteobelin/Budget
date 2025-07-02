import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";
 

export function generateToken(user: {email: string }): string {
  return jwt.sign(
    {
      email: user.email,
    },
    SECRET_KEY as jwt.Secret,
    {
      expiresIn: "12h",
    }
  );
}

