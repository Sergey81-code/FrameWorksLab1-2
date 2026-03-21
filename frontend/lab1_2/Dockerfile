FROM node:20-alpine

WORKDIR /app

COPY frontend/lab1_2/package*.json ./
COPY frontend/lab1_2/tsconfig.json ./

COPY packages/types ./packages/types
COPY packages/protos ./packages/protos

RUN npm install --legacy-peer-deps ./packages/types ./packages/protos

COPY frontend/lab1_2/src ./src
COPY frontend/lab1_2/.env ./.env


EXPOSE 5174

CMD npm run dev