import pool from "../db/index"

export const findByEmail = async (email: string) => {

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  )

  return result.rows[0]
}

export const findById = async (id: string) => {

  const result = await pool.query(
    "SELECT id,email,name FROM users WHERE id=$1",
    [id]
  )

  return result.rows[0]
}

export const create = async ({ email, passwordHash, name }: any) => {

  const result = await pool.query(
    `INSERT INTO users (email,password_hash,name)
     VALUES ($1,$2,$3)
     RETURNING id,email,name`,
    [email, passwordHash, name]
  )

  return result.rows[0]
}