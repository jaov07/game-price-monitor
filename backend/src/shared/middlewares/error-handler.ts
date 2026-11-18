import type { Request, Response, NextFunction } from "express"
import { isAppError } from "../errors/app-error.js"

// Middleware global de captura de erros do Express
export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Trata erros previstos de regras de negócio (400, 404, etc.)
  if (isAppError(error)) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
  }

  // Erros inesperados ou falhas não tratadas
  console.error("Unexpected server error:", error)

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  })
}
