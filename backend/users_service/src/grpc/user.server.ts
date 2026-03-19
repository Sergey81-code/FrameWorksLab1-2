import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import * as UserService from "../services/user.service"

const PROTO_PATH = require.resolve("@lab1_2/protos/proto/user.proto")
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})
const proto: any = grpc.loadPackageDefinition(packageDefinition)
type CreateUserRequest = typeof proto.user.CreateUserRequest.prototype
type GetUserByEmailRequest = typeof proto.user.GetUserByEmailRequest.prototype
type UserResponse = typeof proto.user.UserResponse.prototype

export const userServiceImpl: grpc.UntypedServiceImplementation = {
  CreateUser: async (
    call: grpc.ServerUnaryCall<CreateUserRequest, UserResponse>,
    callback: grpc.sendUnaryData<UserResponse>
  ) => {
    const { id, email, name, passwordHash } = call.request

    const user = await UserService.createUser({ id, email, name, passwordHash })

    callback(null, user)
  },

  GetUserByEmail: async (
    call: grpc.ServerUnaryCall<GetUserByEmailRequest, UserResponse>,
    callback: grpc.sendUnaryData<UserResponse | null>
  ) => {
    const { email } = call.request
    const user = await UserService.getUserByEmail(email)
    callback(null, user)
  },
}