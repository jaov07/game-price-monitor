import { Pool } from "pg"
import { env } from "../../config/env.js"

// Pool de conexões reutilizável para o PostgreSQL
export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

pool.on("error", (error) => {
  console.error("Unexpected error on idle client in pool:", error)
})
