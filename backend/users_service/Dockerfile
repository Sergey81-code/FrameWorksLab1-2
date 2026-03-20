FROM node:20-alpin

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

COPY ../../packages ./shared

RUN npm install --legacy-peer-deps

COPY ./src ./src

EXPOSE 3002
EXPOSE 50051

CMD ["npm", "run", "dev"]