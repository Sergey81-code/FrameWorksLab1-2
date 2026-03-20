import pool from "../db";
import { CreateOrderDto, UpdateOrderDto } from "@lab1_2/types";

export const findAll = async () => {
  const { rows } = await pool.query(`SELECT * FROM orders`);
  return rows;
};

export const findById = async (id: string) => {
  const { rows } = await pool.query(`SELECT * FROM orders WHERE id = $1`, [id]);
  if (!rows[0]) return null;

  const { rows: items } = await pool.query(
    `SELECT product_id, quantity, price FROM order_items WHERE order_id = $1`,
    [id]
  );

  return { ...rows[0], items };
};


export const findByUserId = async (user_id: string) => {
  const { rows } = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1`,
    [user_id]
  );

  const orders = [];
  for (const order of rows) {
    const { rows: items } = await pool.query(
      `SELECT product_id, quantity, price FROM order_items WHERE order_id = $1`,
      [order.id]
    );
    orders.push({ ...order, items });
  }

  return orders;
};

export const createOrder = async (data: CreateOrderDto) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `INSERT INTO orders (user_id) VALUES ($1) RETURNING *`,
      [data.user_id]
    );
    const order = rows[0];

    let total = 0;
    for (const item of data.items) {
      const { rows: productRows } = await client.query(
        `SELECT price FROM products WHERE id = $1`,
        [item.product_id]
      );
      if (!productRows[0]) throw new Error("Product not found");
      const price = parseFloat(productRows[0].price);
      total += price * item.quantity;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, price]
      );
    }

    await client.query(`UPDATE orders SET total = $1 WHERE id = $2`, [total, order.id]);
    await client.query("COMMIT");

    return await findById(order.id);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export const updateOrder = async (id: string, data: UpdateOrderDto) => {
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
    `UPDATE orders SET ${setParts.join(", ")} WHERE id = $${idx} RETURNING *`,
    [...values, id]
  );

  return rows[0] || null;
};

export const deleteOrder = async (id: string) => {
  const { rowCount } = await pool.query(`DELETE FROM orders WHERE id = $1`, [id]);
  if (rowCount === null) return false;
  return rowCount > 0;
};