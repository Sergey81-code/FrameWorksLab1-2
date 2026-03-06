import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/jwt"

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]

  try {

    const payload = verifyAccessToken(token)

    ;(req as any).userId = payload.userId

    next()

  } catch {

    res.status(401).json({ error: "Invalid token" })
  }
}