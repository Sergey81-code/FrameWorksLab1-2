import { Request, Response } from "express"
import * as AuthService from "../services/auth.service"
import { LoginDto, RegisterDto } from "@lab1_2/types"

export const register = async (req: Request, res: Response) => {

  const body: RegisterDto = req.body

  const result = await AuthService.register(body)

  res.json(result)
}

export const login = async (req: Request, res: Response) => {

  const body: LoginDto = req.body

  const tokens = await AuthService.login(body)

  res.json(tokens)
}

export const refresh = async (req: Request, res: Response) => {

  const { refreshToken } = req.body

  const tokens = await AuthService.refresh(refreshToken)

  res.json(tokens)
}