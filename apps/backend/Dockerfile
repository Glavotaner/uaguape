FROM node:22-alpine AS builder

# Install openssl3 for Prisma
RUN apk add --no-cache openssl3
# Install @nestjs/cli globally
RUN yarn global add @nestjs/cli

WORKDIR /app
RUN ls -la
# Copy the monorepo root package.json and yarn.lock
COPY package*.json ./
COPY yarn.lock ./

# Install monorepo dependencies (including backend dependencies)
RUN yarn install --frozen-lockfile

# Copy dependencies
COPY node_modules ./node_modules

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

# Copy the built backend app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Generate Prisma client
WORKDIR /app/packages/@uaguape/db
RUN npx prisma generate

WORKDIR /app

CMD ["npm", "run", "start:prod"]