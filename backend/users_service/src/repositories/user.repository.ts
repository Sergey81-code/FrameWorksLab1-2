import { CreateUserDto, UpdateUserDto } from "@lab1_2/types"
import pool from "../db"

export const createUser = async (data: CreateUserDto) => {

  const result = await pool.query(
    `
    INSERT INTO users (id, email, name)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [data.id, data.email, data.name]
  )

  return result.rows[0]

}

export const findById = async (id: string) => {

  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  )

  return result.rows[0]

}

export const findByEmail = async (email: string) => {

  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  )

  return result.rows[0]

}

export const updateUser = async (id: string, data: UpdateUserDto) => {

  const result = await pool.query(
    `
    UPDATE users
    SET
      name = COALESCE($1, name),
      phone = COALESCE($2, phone),
      birth_date = COALESCE($3, birth_date),
      updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `,
    [data.name, data.phone, data.birth_date, id]
  )

  return result.rows[0]

}

export const updateAvatar = async (id: string, avatar: string) => {

  const result = await pool.query(
    `
    UPDATE users
    SET avatar = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [avatar, id]
  )

  return result.rows[0]

}

export const deleteUser = async (id: string) => {

  await pool.query(
    `DELETE FROM users WHERE id = $1`,
    [id]
  )

}