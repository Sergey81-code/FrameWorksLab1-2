import pool from "./index"

async function migrate() {

  try {

    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `)

    await pool.query(`
      CREATE TABLE categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          parent_id UUID REFERENCES categories(id) ON DELETE SET NULL
      );
    `)

    console.log("Categories table ready")

    await pool.query(`
      CREATE TABLE products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          category_id UUID REFERENCES categories(id),
          price NUMERIC(10,2) NOT NULL,
          discount NUMERIC(5,2) DEFAULT 0,
          quantity INT NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT now()
      );
    `)

    console.log("Products table ready")

    await pool.query(`
      CREATE TABLE product_photos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id UUID REFERENCES products(id) ON DELETE CASCADE,
          url TEXT NOT NULL
      );
    `)

    console.log("Product photos table ready")

  } catch (error) {

    console.error("Migration failed:", error)

  } finally {

    await pool.end()
    process.exit(0)

  }

}

migrate()