import { Router } from "express"
import * as ProductPhotoController from "../controllers/product_photo.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: ProductPhotos
 *   description: Product photo management
 */

/**
 * @swagger
 * /product-photos/{productId}:
 *   get:
 *     summary: Get all photos for a product
 *     tags: [ProductPhotos]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of photo URLs
 *       404:
 *         description: Product not found
 */
router.get("/:productId", ProductPhotoController.getPhotos)

/**
 * @swagger
 * /product-photos/{productId}:
 *   post:
 *     summary: Add a new photo to a product
 *     tags: [ProductPhotos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Photo added
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post("/:productId", authMiddleware, ProductPhotoController.addPhoto)

/**
 * @swagger
 * /product-photos/{photoId}:
 *   delete:
 *     summary: Delete a photo
 *     tags: [ProductPhotos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Photo ID
 *     responses:
 *       200:
 *         description: Photo deleted
 *       404:
 *         description: Photo not found
 */
router.delete("/:photoId", authMiddleware, ProductPhotoController.deletePhoto)

export default router