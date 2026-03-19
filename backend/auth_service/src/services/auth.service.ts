import { LoginDto, RegisterDto } from "@lab1_2/types"
import { generateTokens, verifyRefreshToken } from "../utils/jwt"
import { comparePassword, hashPassword } from "../utils/password"
import * as UserClient from "../grpc/user.client"
import crypto from "crypto"

export const register = async (data: RegisterDto) => {

  const { email, password, name } = data

  const existing = await UserClient.getUserByEmail(email)

  if (existing && (existing as any).id) {
    throw new Error("User already exists")
  }

  const passwordHash = await hashPassword(password)

  const userId = crypto.randomUUID()

  const user = await UserClient.createUser({
    id: userId,
    email,
    name,
    passwordHash
  })

  const tokens = generateTokens(userId)

  return tokens
}

export const login = async (data: LoginDto) => {
  const { email, password } = data

  const user = await UserClient.getUserByEmail(email)

  if (!user || !(user as any).id) {
    throw new Error("Invalid credentials")
  }

  const valid = await comparePassword(password, (user as any).passwordHash)

  if (!valid) {
    throw new Error("Invalid credentials")
  }

  return generateTokens((user as any).id)
}

export const refresh = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken)
  return generateTokens(payload.userId)
}