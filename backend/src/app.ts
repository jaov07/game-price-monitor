import express from "express"
import { errorHandler } from "./shared/middlewares/error-handler.js"

const app = express()

app.use(express.json())

// Rota de verificação de integridade da API
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "GamePriceMonitor API is running",
  })
})

// O middleware de tratamento de erros deve vir após todas as rotas
app.use(errorHandler)

export default app
