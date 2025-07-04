import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";
import { ObjectId } from "mongodb";
 

export function generateToken(user: {email: string,_id:ObjectId }): string {
  return jwt.sign(
    {
      email: user.email,
      _id:user._id.toString()
    },
    SECRET_KEY as jwt.Secret,
    {
      expiresIn: "12h",
    }
  );
}

