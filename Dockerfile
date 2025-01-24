# Step 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Step 2: Production Stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json /app/node_modules ./node_modules/

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]
