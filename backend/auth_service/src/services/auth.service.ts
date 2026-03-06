import * as UserRepository from "../repositories/user.repository"
import { generateTokens, verifyRefreshToken } from "../utils/jwt"
import { comparePassword, hashPassword } from "../utils/password"

export const register = async ({ email, password, name }: any) => {

  const existing = await UserRepository.findByEmail(email)

  if (existing) {
    throw new Error("User already exists")
  }

  const passwordHash = await hashPassword(password)

  const user = await UserRepository.create({
    email,
    passwordHash,
    name
  })

  const tokens = generateTokens(user.id)

  return tokens
}

export const login = async ({ email, password }: any) => {

  const user = await UserRepository.findByEmail(email)

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const valid = await comparePassword(password, user.password_hash)

  if (!valid) {
    throw new Error("Invalid credentials")
  }

  const tokens = generateTokens(user.id)

  return tokens
}

export const refresh = async (refreshToken: string) => {

  const payload = verifyRefreshToken(refreshToken)

  const tokens = generateTokens(payload.userId)

  return tokens
}

export const getMe = async (userId: string) => {

  const user = await UserRepository.findById(userId)

  return user
}