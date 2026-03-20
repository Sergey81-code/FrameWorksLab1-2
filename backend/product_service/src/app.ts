import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"

import { swaggerSpec } from "./swagger/swagger"
import { errorMiddleware } from "./middlewares/error.middleware"
import categoryRoutes from "./routes/category.routes"
import productRoutes from "./routes/product.routes"
import productPhotoRoutes from "./routes/product_photo.routes"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use("/categories", categoryRoutes)
app.use("/products", productRoutes)
app.use("/product-photos", productPhotoRoutes)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(errorMiddleware);

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

const HTTP_PORT = process.env.PORT || 3002
app.listen(HTTP_PORT, () => {
  console.log(`Users REST API running on http://localhost:${HTTP_PORT}`)
})