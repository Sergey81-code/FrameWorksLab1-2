import pool from "../db";
import { CreateCategoryDto, UpdateCategoryDto } from "@lab1_2/types";

export const findAll = async () => {
  const { rows } = await pool.query(`SELECT * FROM categories`);
  return rows;
};

export const findById = async (id: string) => {
  const { rows } = await pool.query(`SELECT * FROM categories WHERE id = $1`, [id]);
  return rows[0] || null;
};

export const createCategory = async (data: CreateCategoryDto) => {
  const { rows } = await pool.query(
    `INSERT INTO categories (name, parent_id)
     VALUES ($1, $2)
     RETURNING *`,
    [data.name, data.parent_id || null]
  );
  return rows[0];
};

export const updateCategory = async (id: string, data: UpdateCategoryDto) => {
  const setParts: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const key of Object.keys(data)) {
    setParts.push(`${key} = $${idx}`);
    // @ts-ignore
    values.push(data[key]);
    idx++;
  }

  if (setParts.length === 0) return null;

  const { rows } = await pool.query(
    `UPDATE categories SET ${setParts.join(", ")} WHERE id = $${idx} RETURNING *`,
    [...values, id]
  );
  return rows[0] || null;
};

export const deleteCategory = async (id: string) => {
  const { rowCount } = await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
  if (rowCount === null) return false;
  return rowCount > 0;
};