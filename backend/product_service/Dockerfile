FROM node:20-alpine

WORKDIR /app

COPY backend/product_service/package*.json ./
COPY backend/product_service/tsconfig.json ./

COPY packages/types ./packages/types
COPY packages/protos ./packages/protos

RUN npm install --legacy-peer-deps ./packages/types ./packages/protos

COPY backend/product_service/src ./src
COPY backend/product_service/.env ./.env

EXPOSE 3003

CMD npm run migrate && npm run dev