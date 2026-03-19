import { Request, Response } from "express"
import * as UserService from "../services/user.service"
import { AuthRequest } from "../middlewares/auth.middleware"


export const getMe = async (req: AuthRequest, res: Response) => {

  const user = await UserService.getUserProfile(req.userId!)

  res.json(user)

}

export const updateMe = async (req: AuthRequest, res: Response) => {

  const user = await UserService.updateUserProfile(
    req.userId!,
    req.body
  )

  res.json(user)

}

export const updateAvatar = async (req: AuthRequest, res: Response) => {

  const user = await UserService.updateAvatar(
    req.userId!,
    req.body.avatar
  )

  res.json(user)

}

export const deleteMe = async (req: AuthRequest, res: Response) => {

  await UserService.deleteUser(req.userId!)

  res.json({ success: true })

}