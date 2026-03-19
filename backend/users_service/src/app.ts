import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"

import userRoutes from "./routes/user.routes"
import { swaggerSpec } from "./swagger/swagger"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/users", userRoutes)

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

dotenv.config()

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`)
})