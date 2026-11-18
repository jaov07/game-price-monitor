import "dotenv/config"

// O QUE ISSO FAZ:
// Lê e valida as variáveis de ambiente da aplicação em um único lugar.
// Se uma variável obrigatória faltar (como DATABASE_URL), o sistema falha logo na inicialização.
function loadEnv() {
  const port = Number(process.env.PORT) || 3000
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in .env file")
  }

  return {
    port,
    databaseUrl,
    nodeEnv: process.env.NODE_ENV || "development",
  }
}

export const env = loadEnv()
