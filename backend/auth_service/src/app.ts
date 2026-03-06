import express from "express"
import authRoutes from "./routes/auth.routes"

const app = express()

app.use(express.json())

const PORT = 3000

app.use("/auth", authRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})