FROM node:18-alpine

ENV API_URL=https://staging.api.smart-study.fr

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm ci

COPY . /app

RUN npm run build

CMD node .output/server/index.mjs