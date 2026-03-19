import { Request, Response } from "express"
import * as AuthService from "../services/auth.service"
import { LoginDto, RegisterDto } from "@lab1_2/types"

export const register = async (req: Request, res: Response) => {

  try {
    const body: RegisterDto = req.body
    const result = await AuthService.register(body)
    res.status(201).json(result);
  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }

}

export const login = async (req: Request, res: Response) => {
  try {
    const body: LoginDto = req.body
    const tokens = await AuthService.login(body)
    res.status(200).json(tokens)
  } catch (err: any) {
      const status = err.statusCode || 500;
      res.status(status).json({ error: err.message });
  }

  const body: LoginDto = req.body

  const tokens = await AuthService.login(body)

  res.json(tokens)
}

export const refresh = async (req: Request, res: Response) => {

  try{
    const { refreshToken } = req.body
    const tokens = await AuthService.refresh(refreshToken)
    res.status(200).json(tokens)

  } catch (err: any) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
  }


}