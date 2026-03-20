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
      CREATE TABLE deliveries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id UUID NOT NULL,
        address TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        delivery_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    console.log("Deliveries table ready");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();