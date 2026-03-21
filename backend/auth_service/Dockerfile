FROM node:20-alpine

WORKDIR /app

COPY backend/auth_service/package*.json ./
COPY backend/auth_service/tsconfig.json ./

COPY packages/types ./packages/types
COPY packages/protos ./packages/protos

RUN npm install --legacy-peer-deps ./packages/types ./packages/protos

COPY backend/auth_service/src ./src
COPY backend/auth_service/.env ./.env


EXPOSE 3000

CMD npm run dev
