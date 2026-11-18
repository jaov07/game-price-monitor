import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { pool } from "./pool.js"

// O QUE ISSO FAZ:
// Executor de migrações em SQL puro.
// 1. Cria a tabela _migrations se ela não existir.
// 2. Lê os arquivos .sql da pasta migrations/ em ordem alfabética.
// 3. Executa apenas as migrações que ainda não rodaram, dentro de uma transação segura (BEGIN/COMMIT).

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MIGRATIONS_DIR = path.join(__dirname, "migrations")

async function runMigrations() {
  const client = await pool.connect()

  try {
    console.log("Checking database migrations...")

    // 1. Garante que a tabela de controle de migrações existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `)

    // 2. Busca as migrações que já foram executadas
    const { rows: executedRows } = await client.query<{ name: string }>(
      "SELECT name FROM _migrations ORDER BY id ASC",
    )
    const executedMigrations = new Set(executedRows.map((row) => row.name))

    // 3. Lê todos os arquivos .sql do diretório
    const allFiles = await fs.readdir(MIGRATIONS_DIR)
    const migrationFiles = allFiles
      .filter((file) => file.endsWith(".sql"))
      .sort()

    const pendingMigrations = migrationFiles.filter(
      (file) => !executedMigrations.has(file),
    )

    if (pendingMigrations.length === 0) {
      console.log("Database is already up to date. No pending migrations.")
      return
    }

    console.log(`Found ${pendingMigrations.length} pending migration(s).`)

    // 4. Executa cada migração pendente dentro de uma transação
    for (const file of pendingMigrations) {
      console.log(`Executing migration: ${file}`)
      const filePath = path.join(MIGRATIONS_DIR, file)
      const sql = await fs.readFile(filePath, "utf-8")

      try {
        await client.query("BEGIN")
        await client.query(sql)
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [file])
        await client.query("COMMIT")
        console.log(`Migration applied successfully: ${file}`)
      } catch (migrationError) {
        await client.query("ROLLBACK")
        console.error(`Failed to apply migration: ${file}. Transaction rolled back.`)
        throw migrationError
      }
    }

    console.log("All migrations applied successfully!")
  } finally {
    client.release()
  }
}

runMigrations()
  .catch((error) => {
    console.error("Migration runner failed:")
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
