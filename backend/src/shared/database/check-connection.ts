import { pool } from "./pool.js"


type PingRow = {
  currentTime: Date
  databaseName: string
  currentUser: string
}

async function checkDatabaseConnection() {
  const { rows } = await pool.query<PingRow>(
    `SELECT 
      now() AS "currentTime", 
      current_database() AS "databaseName", 
      current_user AS "currentUser"`,
  )

  const [row] = rows

  console.log("PostgreSQL connection OK")
  console.log("  Database:", row.databaseName)
  console.log("  User:", row.currentUser)
  console.log("  Server time:", row.currentTime)
}

checkDatabaseConnection()
  .catch((error) => {
    console.error("Failed to connect to PostgreSQL:")
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
