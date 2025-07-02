import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 8; 
  return await bcrypt.hash(password, saltRounds);
}