import pool from "./index"

async function migrate() {

  try {

    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        password TEXT NOT NULL,
        avatar TEXT,
        phone TEXT,
        birth_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    console.log("Users table ready")

  } catch (error) {

    console.error("Migration failed:", error)

  } finally {

    await pool.end()
    process.exit(0)

  }

}

migrate()