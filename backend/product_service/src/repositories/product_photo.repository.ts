import pool from "../db"

export const getPhotos = async (productId: string) => {
  const { rows } = await pool.query(`SELECT url FROM product_photos WHERE product_id = $1`, [productId]);
  return rows.map(r => r.url);
};

export const addPhoto = async (productId: string, url: string) => {
  const { rows } = await pool.query(
    `INSERT INTO product_photos (product_id, url) VALUES ($1, $2) RETURNING *`,
    [productId, url]
  );
  return rows[0] || null;
};

export const deletePhoto = async (photoId: string) => {
  const { rowCount } = await pool.query(
    `DELETE FROM product_photos WHERE id = $1`,
    [photoId]
  );
  if (rowCount === null) return false;
  return rowCount > 0;
};