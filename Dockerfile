FROM node:18-alpine

COPY . /app

WORKDIR /app

RUN npm ci
RUN npm run build

CMD node .output/server/index.mjs