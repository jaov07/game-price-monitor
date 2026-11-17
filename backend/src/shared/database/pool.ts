import { Pool } from "pg"
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error(
    "DATABASE_URL nao definida. Crie backend/.env com " +
      "DATABASE_URL=postgresql://usuario:senha@localhost:5432/banco",
  )
}

export const pool = new Pool({
  connectionString,
  max: 10, 
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})


pool.on("error", (error) => {
  console.error("Erro inesperado em conexao ociosa do pool:", error)
})
