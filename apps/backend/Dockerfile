# Use a suitable base image
FROM node:22-alpine AS builder

WORKDIR /app
RUN apk add --no-cache openssl3   # or the equivalent OpenSSL package for your Alpine version

# Copy the monorepo root package.json and yarn.lock
COPY package*.json ./
COPY yarn.lock ./

# Copy the monorepo packages
COPY ../../packages ./packages

# Install monorepo dependencies (including backend dependencies)
RUN yarn install --frozen-lockfile

COPY node_modules ./node_modules

# Install @nestjs/cli globally
RUN yarn global add @nestjs/cli

# Build the monorepo packages
RUN yarn workspace @uaguape/common build
RUN yarn workspace @uaguape/db build
RUN yarn workspace @uaguape/linking build

# Copy the backend app's package.json and source code
COPY apps/backend/package*.json ./
COPY apps/backend/tsconfig.json ./
COPY apps/backend/src/ ./src/
COPY apps/backend/firebase.config.json ./
COPY packages/ ./packages/



# Build the backend app
RUN yarn build

# Stage 2: Production image
FROM node:18-alpine3.17

WORKDIR /app

# Copy only the built backend app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

WORKDIR /app/packages/@uaguape/db

RUN npx prisma generate

WORKDIR /app

CMD ["npm", "run", "start:prod"]