import bcrypt from "bcrypt"

import dotenv from "dotenv"

dotenv.config()

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10", 10)


export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}