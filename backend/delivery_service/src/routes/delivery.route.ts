import { Router } from "express";
import * as DeliveryController from "../controllers/delivery.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: Delivery management
 */

/**
 * @swagger
 * /deliveries:
 *   get:
 *     summary: Get all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List of deliveries
 */
router.get("/", DeliveryController.getAllDeliveries)

/**
 * @swagger
 * /deliveries/{id}:
 *   get:
 *     summary: Get delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery object
 *       404:
 *         description: Delivery not found
 */
router.get("/:id", DeliveryController.getDeliveryById)

/**
 * @swagger
 * /deliveries:
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *               address:
 *                 type: string
 *               delivery_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Delivery created
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, DeliveryController.createDelivery)

/**
 * @swagger
 * /deliveries/{id}:
 *   patch:
 *     summary: Update delivery
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_transit, delivered, canceled]
 *               delivery_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Delivery updated
 *       404:
 *         description: Delivery not found
 */
router.patch("/:id", authMiddleware, DeliveryController.updateDelivery)

/**
 * @swagger
 * /deliveries/{id}:
 *   delete:
 *     summary: Delete delivery
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delivery deleted
 *       404:
 *         description: Delivery not found
 */
router.delete("/:id", authMiddleware, DeliveryController.deleteDelivery)

export default router