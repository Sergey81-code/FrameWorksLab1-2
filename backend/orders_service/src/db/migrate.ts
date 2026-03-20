import pool from "./index";

async function migrate() {
  try {

    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `)
    
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await pool.query(`
      CREATE TABLE orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        total NUMERIC(10,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    await pool.query(`
      CREATE TABLE order_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID NOT NULL,
        quantity INT NOT NULL,
        price NUMERIC(10,2) NOT NULL
      );
    `);

    console.log("Orders and Order Items tables ready");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();