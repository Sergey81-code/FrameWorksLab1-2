import { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const status = err.statusCode || 500;

  res.status(status).json({
    error: err.message || "Internal server error",
  });
};