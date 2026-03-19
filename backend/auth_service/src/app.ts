import express from "express"
import authRoutes from "./routes/auth.routes"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger/swagger"
import { errorMiddleware } from "./middlewares/error.middleware"

const app = express()

app.use(express.json())

const PORT = 3000

app.use("/auth", authRoutes)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})