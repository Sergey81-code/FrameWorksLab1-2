import * as UserRepository from "../repositories/user.repository"
import { CreateUserDto, UpdateUserDto } from "@lab1_2/types"


export const createUser = async (data: CreateUserDto) => {
  const { id, email, name, passwordHash } = data

  const existing = await UserRepository.findByEmail(email)
  if (existing) {
    throw new Error("User already exists")
  }

  const user = await UserRepository.create({
    id,
    email,
    name,
    passwordHash
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash
  }
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
    passwordHash: user.passwordHash
  }
}


export const getUserProfile = async (userId: string) => {
  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new Error("User not found")
  }


  return {
    id: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash
  }
}

export const updateUserProfile = async (userId: string, data: UpdateUserDto) => {
  const updated = await UserRepository.updateUser(userId, data)

  if (!updated) {
    throw new Error("User not found or update failed")
  }

  return {
    id: updated.id,
    email: updated.email,
    name: updated.name,
    passwordHash: updated.passwordHash
  }
}


export const updateAvatar = async (userId: string, avatar: string) => {
  const updated = await UserRepository.updateAvatar(userId, avatar)

  if (!updated) {
    throw new Error("User not found or avatar update failed")
  }

  return updated
}


export const deleteUser = async (userId: string) => {
  const deleted = await UserRepository.deleteUser(userId)

  if (!deleted) {
    throw new Error("User not found or deletion failed")
  }

  return deleted
}