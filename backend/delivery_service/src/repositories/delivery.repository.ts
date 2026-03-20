import pool from "../db";
import { CreateDeliveryDto, UpdateDeliveryDto } from "@lab1_2/types";

export const findAll = async () => {
  const { rows } = await pool.query(`SELECT * FROM deliveries`);
  return rows;
};

export const findById = async (id: string) => {
  const { rows } = await pool.query(`SELECT * FROM deliveries WHERE id = $1`, [id]);
  return rows[0] || null;
};

export const createDelivery = async (data: CreateDeliveryDto) => {
  const { rows } = await pool.query(
    `INSERT INTO deliveries (order_id, address, delivery_date)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.order_id, data.address, data.delivery_date || null]
  );
  return rows[0];
};

export const updateDelivery = async (id: string, data: UpdateDeliveryDto) => {
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
    `UPDATE deliveries SET ${setParts.join(", ")} WHERE id = $${idx} RETURNING *`,
    [...values, id]
  );
  return rows[0] || null;
};

export const deleteDelivery = async (id: string) => {
  const { rowCount } = await pool.query(`DELETE FROM deliveries WHERE id = $1`, [id]);
  if (rowCount === null) return false;
  return rowCount > 0;
};