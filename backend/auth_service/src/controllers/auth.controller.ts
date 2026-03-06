import { Request, Response } from "express"
import * as AuthService from "../services/auth.service"

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body

  const result = await AuthService.register({
    email,
    password,
    name
  })

  res.json(result)
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const tokens = await AuthService.login({
    email,
    password
  })

  res.json(tokens)
}

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  const tokens = await AuthService.refresh(refreshToken)

  res.json(tokens)
}


export const me = async (req: Request, res: Response) => {
  const userId = (req as any).userId

  const user = await AuthService.getMe(userId)

  res.json(user)
}