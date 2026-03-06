import { Router } from "express"
import * as AuthController from "../controllers/auth.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

router.post("/register", AuthController.register)
router.post("/login", AuthController.login)
router.post("/refresh", AuthController.refresh)

router.get("/me", authMiddleware, AuthController.me)

export default router