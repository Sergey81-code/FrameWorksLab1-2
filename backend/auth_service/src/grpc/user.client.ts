import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { CreateUserDto } from "@lab1_2/types"

const PROTO_PATH = require.resolve("@lab1_2/protos/proto/user.proto")

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const proto = grpc.loadPackageDefinition(packageDefinition) as any

const UserService = proto.user.UserService

const client = new UserService(
  process.env.USER_SERVICE_ADDRESS,
  grpc.credentials.createInsecure()
)

export const createUser = (data: CreateUserDto) => {
  return new Promise((resolve, reject) => {
    client.CreateUser(data, (err: any, response: any) => {
      if (err) return reject(err)
      resolve(response)
    })
  })
}

export const getUserByEmail = (email: string) => {
  return new Promise((resolve, reject) => {
    client.GetUserByEmail({ email }, (err: any, response: any) => {
      if (err) return reject(err)
      resolve(response)
    })
  })
}