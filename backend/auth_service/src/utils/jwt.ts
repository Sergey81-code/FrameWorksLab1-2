import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const ACCESS_SECRET = process.env.ACCESS_SECRET
if (!ACCESS_SECRET) {
  throw new Error("ACCESS_SECRET is not set in .env")
}

const REFRESH_SECRET = process.env.REFRESH_SECRET
if (!REFRESH_SECRET) {
  throw new Error("REFRESH_SECRET is not set in .env")
}

export const generateTokens = (userId: string) => {

  const accessToken = jwt.sign(
    { userId },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  )

  const refreshToken = jwt.sign(
    { userId },
    REFRESH_SECRET,
    { expiresIn: "7d" }
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