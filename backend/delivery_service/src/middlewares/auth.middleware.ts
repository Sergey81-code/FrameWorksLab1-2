import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  const header = req.headers.authorization

  if (!header) {
    return res.status(401).json({ error: "No token" })
  }

  const token = header.split(" ")[1]

  try {

    const payload = jwt.verify(
      token,
      process.env.ACCESS_SECRET as string
    ) as any

    req.userId = payload.userId

    next()

  } catch {

    res.status(401).json({ error: "Invalid token" })

  }

}