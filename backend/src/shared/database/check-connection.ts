import "dotenv/config"
import { pool } from "./pool.js"

type PingRow = {
  agora: Date
  banco: string
  usuario: string
}

async function main() {
  const { rows } = await pool.query<PingRow>(
    "SELECT now() AS agora, current_database() AS banco, current_user AS usuario",
  )

  const [row] = rows

  console.log("Conexao com o PostgreSQL OK")
  console.log("  Banco:", row.banco)
  console.log("  Usuario:", row.usuario)
  console.log("  Hora do servidor:", row.agora)
}

main()
  .catch((error) => {
    console.error("Falha ao conectar no PostgreSQL:")
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
