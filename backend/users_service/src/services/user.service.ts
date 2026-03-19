import { UserDeleteFailed, UserExistsError, UserNotFoundError, UserUpdateFailed } from "../errors/errors"
import * as UserRepository from "../repositories/user.repository"
import { CreateUserDto, UpdateUserDto, UserResponse} from "@lab1_2/types"


const toUserResponse = (user: any): UserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatar: user.avatar,
  phone: user.phone,
  birth_date: user.birth_date
});

export const createUser = async (data: CreateUserDto) => {
  const { id, email, name, passwordHash } = data

  const existing = await UserRepository.findByEmail(email)
  if (existing) {
    throw new UserExistsError()
  }

  const user = await UserRepository.createUser({
    id,
    email,
    name,
    passwordHash
  })

  return toUserResponse(user)
}

export const getUserByEmail = async (email: string) => {
  const user = await UserRepository.findByEmail(email)

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.password
  }
}


export const getUser = async (userId: string) => {
  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new UserNotFoundError()
  }

  return user
}

export const getUserProfile = async (userId: string) => {
  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new UserNotFoundError()
  }

  return toUserResponse(user)
}

export const updateUserProfile = async (userId: string, data: UpdateUserDto) => {

  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new UserNotFoundError()
  }

  const updated = await UserRepository.updateUser(userId, data)

  if (!updated) {
    throw new UserUpdateFailed()
  }

  return toUserResponse(updated)
}


export const updateAvatar = async (userId: string, avatar: string) => {
  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new UserNotFoundError()
  }

  const updated = await UserRepository.updateAvatar(userId, avatar)

  if (!updated) {
    throw new UserUpdateFailed()
  }

  return toUserResponse(updated)
}


export const deleteUser = async (userId: string) => {
  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new UserNotFoundError()
  }

  const deleted = await UserRepository.deleteUser(userId)

  if (!deleted) {
    throw new UserDeleteFailed()
  }

  return deleted
}