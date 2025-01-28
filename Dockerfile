FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

COPY .env .env

CMD ["pnpm", "start:prod"]
