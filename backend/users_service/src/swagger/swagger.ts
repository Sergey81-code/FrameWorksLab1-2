import swaggerJSDoc from "swagger-jsdoc"

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "API"
    },
    components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
        }
    },
    security: [
        {
        bearerAuth: []
        }
    ],
    servers: [
      {
        url: "http://localhost:3002"
      }
    ]
  },
  apis: ["./src/routes/*.ts"]
}

export const swaggerSpec = swaggerJSDoc(options)