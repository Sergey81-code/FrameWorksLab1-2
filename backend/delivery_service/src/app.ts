import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"

import { swaggerSpec } from "./swagger/swagger"
import { errorMiddleware } from "./middlewares/error.middleware"
import deliveryRoutes from "./routes/delivery.route"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use("/deliveries", deliveryRoutes)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(errorMiddleware);

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

const HTTP_PORT = process.env.PORT || 3002
app.listen(HTTP_PORT, () => {
  console.log(`Users REST API running on http://localhost:${HTTP_PORT}`)
})