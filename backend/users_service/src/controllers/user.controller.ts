import { Request, Response } from "express"
import * as UserService from "../services/user.service"
import { AuthRequest } from "../middlewares/auth.middleware"
import * as fs from "fs"
import * as path from "path"
import multer from "multer"
import dotenv from "dotenv"


dotenv.config()


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

const AVATAR_DIR = process.env.AVATAR_DIR || "/uploads/avatars"

if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true })

export const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
    filename: (_req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  })
})

export const updateAvatarFile = async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" })

  const url = `/avatars/${req.file.filename}`

  const user = await UserService.updateAvatar(req.userId!, url)
  res.json(user)
}

export const deleteMe = async (req: AuthRequest, res: Response) => {

  await UserService.deleteUser(req.userId!)

  res.json({ success: true })

}