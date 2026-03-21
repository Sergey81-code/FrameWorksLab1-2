FROM node:20-alpine

WORKDIR /app

COPY backend/delivery_service/package*.json ./
COPY backend/delivery_service/tsconfig.json ./

COPY packages/types ./packages/types
COPY packages/protos ./packages/protos

RUN npm install --legacy-peer-deps ./packages/types ./packages/protos

COPY backend/delivery_service/src ./src
COPY backend/delivery_service/.env ./.env

EXPOSE 3004

CMD npm run migrate && npm run dev