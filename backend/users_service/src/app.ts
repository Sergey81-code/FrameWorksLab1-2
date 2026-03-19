import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"

import userRoutes from "./routes/user.routes"
import { swaggerSpec } from "./swagger/swagger"
import { userServiceImpl } from "./grpc/user.server"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use("/users", userRoutes)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

const HTTP_PORT = process.env.PORT || 3002
app.listen(HTTP_PORT, () => {
  console.log(`Users REST API running on http://localhost:${HTTP_PORT}`)
})

const PROTO_PATH = require.resolve("@lab1_2/protos/proto/user.proto")
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
const proto: any = grpc.loadPackageDefinition(packageDefinition)
const UserService = proto.user.UserService

const grpcServer = new grpc.Server()
grpcServer.addService(UserService.service, userServiceImpl)

const GRPC_PORT = process.env.GRPC_PORT
grpcServer.bindAsync(`127.0.0.1:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error("Failed to start gRPC server:", err)
    return
  }
  console.log(`Users gRPC server running on 0.0.0.0:${port}`)
})