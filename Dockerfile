FROM node:18-alpine

ENV API_URL="https://staging.api.smart-study.fr"

COPY . /app

WORKDIR /app

RUN npm ci
RUN npm run build

CMD node .output/server/index.mjs