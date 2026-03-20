import pool from "../db"
import { CreateProductDto, UpdateProductDto } from "@lab1_2/types"

export const findAll = async () => {
  const { rows } = await pool.query(`SELECT * FROM products WHERE is_active = true`);
  return rows;
};

export const findById = async (id: string) => {
  const { rows } = await pool.query(`SELECT * FROM products WHERE id = $1`, [id]);
  return rows[0] || null;
};

export const createProduct = async (data: CreateProductDto) => {
  const { rows } = await pool.query(
    `INSERT INTO products (name, category_id, price, discount, quantity, description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.name, data.category_id || null, data.price, data.discount || 0, data.quantity, data.description || null]
  );
  return rows[0];
};

export const updateProduct = async (id: string, data: UpdateProductDto) => {
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
    `UPDATE products SET ${setParts.join(", ")} WHERE id = $${idx} RETURNING *`,
    [...values, id]
  );

  return rows[0] || null;
};

export const deleteProduct = async (id: string) => {
  const { rowCount } = await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
  if (rowCount === null) return false;
  return rowCount > 0;
};