import { Router } from "express"
import * as UserController from "../controllers/user.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User personal account management
 */



/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, UserController.getMe)


/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "+49123456789"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "1995-05-20"
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: Unauthorized
 */
router.patch("/me", authMiddleware, UserController.updateMe)


/**
 * @swagger
 * /users/me/avatar:
 *   patch:
 *     summary: Update user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: New avatar file
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   description: URL of the uploaded avatar
 *                   example: "/avatars/1681234567890.jpg"
 *       400:
 *         description: No file uploaded or invalid file
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/me/avatar",
  authMiddleware,
  UserController.uploadAvatar.single("avatar"),
  UserController.updateAvatarFile
)


/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete current user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted
 *       401:
 *         description: Unauthorized
 */
router.delete("/me", authMiddleware, UserController.deleteMe)

export default router