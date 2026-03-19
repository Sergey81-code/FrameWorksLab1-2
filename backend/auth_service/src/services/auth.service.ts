import { LoginDto, RegisterDto } from "@lab1_2/types"
import { generateTokens, verifyRefreshToken } from "../utils/jwt"
import { comparePassword, hashPassword } from "../utils/password"
import * as UserClient from "../grpc/user.client"
import crypto from "crypto"
import { ExpiredTokenError, InvalidTokenError, InvalidUsernameOrPasswordError, MissingTokenError, UserExistsError, UserNotFoundError } from "../errors/errors"

export const register = async (data: RegisterDto) => {

  const { email, password, name } = data

  const existing = await UserClient.getUserByEmail(email)

  if (existing && (existing as any).id) {
    throw new  UserExistsError();
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
    throw new InvalidUsernameOrPasswordError()
  }

  const valid = await comparePassword(password, (user as any).passwordHash)

  if (!valid) {
    throw new InvalidUsernameOrPasswordError()
  }

  return generateTokens((user as any).id)
}

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new MissingTokenError();
  }

  let payload: any;
  try {
    payload = verifyRefreshToken(refreshToken); 
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new ExpiredTokenError();
    }
    throw new InvalidTokenError();
  }

  if (!payload || !payload.userId) {
    throw new InvalidTokenError();
  }


  const tokens = generateTokens(payload.userId);

  return tokens;
};