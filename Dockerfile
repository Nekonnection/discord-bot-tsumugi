FROM node:lts-alpine AS dependencies

RUN apk update && apk add --no-cache font-noto-cjk && apk add --no-cache tzdata && apk add --no-cache bash

WORKDIR /app
COPY package*.json ./
RUN npm install

FROM dependencies AS builder

COPY . .
RUN npx prisma generate
RUN npm run compile

FROM dependencies AS development

WORKDIR /app
COPY . .
RUN npx prisma generate

CMD ["npm", "run", "dev"]

FROM dependencies AS production

ENV NODE_ENV=production
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/prisma ./prisma

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]