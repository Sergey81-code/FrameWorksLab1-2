import jwt, { SignOptions } from "jsonwebtoken"
import dotenv from "dotenv"
import { ConfigError } from "../errors/errors"

dotenv.config()

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]

const ACCESS_SECRET = process.env.ACCESS_SECRET
if (!ACCESS_SECRET) {
  throw new ConfigError("ACCESS_SECRET is not set in .env");
}

const REFRESH_SECRET = process.env.REFRESH_SECRET
if (!REFRESH_SECRET) {
  throw new ConfigError("REFRESH_SECRET is not set in .env")
}

export const generateTokens = (userId: string) => {

  const accessToken = jwt.sign(
    { userId },
    ACCESS_SECRET,
    { expiresIn:  ACCESS_EXPIRES}
  )

  const refreshToken = jwt.sign(
    { userId },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES}
  )

  return {
    accessToken,
    refreshToken
  }
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as any
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as any
}