FROM node:23-alpine AS builder

# Install @nestjs/cli globally
RUN yarn global add @nestjs/cli

WORKDIR /app

# Copy the monorepo root package.json and yarn.lock
COPY package*.json yarn.lock ./

# Copy the workspaces
COPY apps/backend ./apps/backend
COPY packages/@uaguape/common ./packages/@uaguape/common
COPY packages/@uaguape/db ./packages/@uaguape/db
COPY packages/@uaguape/linking ./packages/@uaguape/linking
COPY packages/@uaguape/routes ./packages/@uaguape/routes

# Install monorepo dependencies (including backend dependencies)
RUN yarn install --frozen-lockfile

ENV NODE_OPTIONS="--max-old-space-size=1024"

# Build the monorepo packages
RUN yarn workspace @uaguape/common build
RUN yarn workspace @uaguape/db build
RUN yarn workspace @uaguape/linking build
RUN yarn workspace @uaguape/routes build

# Copy the backend app's package.json and source code
COPY apps/backend/package*.json apps/backend/tsconfig.json apps/backend/firebase.config.json ./
COPY apps/backend/src/ ./src/
COPY packages/ ./packages/

# Build the backend app
RUN yarn build

# Stage 2: Production image
FROM node:23-alpine

WORKDIR /app

# Copy the built backend app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/yarn.lock /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Install openssl3 for Prisma and symlink libssl.so.3 to /lib
RUN apk add --no-cache openssl3 && ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3 

# Generate Prisma client
WORKDIR /app/packages/@uaguape/db
RUN npx prisma generate

WORKDIR /app

CMD ["npm", "run", "start:prod"]