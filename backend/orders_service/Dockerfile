FROM node:20-alpine

WORKDIR /app

COPY backend/orders_service/package*.json ./
COPY backend/orders_service/tsconfig.json ./

COPY packages/types ./packages/types
COPY packages/protos ./packages/protos

RUN npm install --legacy-peer-deps ./packages/types ./packages/protos

COPY backend/orders_service/src ./src
COPY backend/orders_service/.env ./.env

EXPOSE 3006

CMD npm run migrate && npm run dev