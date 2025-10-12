FROM node:24.10-trixie-slim AS dependencies

RUN apt update && apt install -y --no-install-recommends ca-certificates fonts-noto-cjk tzdata bash && apt clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./
RUN echo 'export PS1="\\u:\\w\\$ "' >> /home/node/.bashrc
RUN npm install

FROM dependencies AS builder
USER node

COPY --chown=node:node . .
RUN npx prisma generate
RUN npm run compile

FROM dependencies AS development
USER node

WORKDIR /app
COPY --chown=node:node . .
RUN npx prisma generate

CMD ["sleep", "infinity"]

FROM node:24.10-trixie-slim AS production

ENV NODE_ENV=production
WORKDIR /app

COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=dependencies --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/config ./config
COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]