FROM node:23-alpine AS builder

# Install @nestjs/cli globally
RUN yarn global add @nestjs/cli

WORKDIR /app

# Copy the monorepo root package.json and yarn.lock
COPY package*.json yarn.lock ./

# Replace "apps/*" with "apps/backend" in package.json so that only the backend app dependencies are installed
RUN sed -i 's/"apps\/\*"/"apps\/backend"/g' package.json

# Copy the apps and packages because we need the source code and package.jsons

# Copy the backend app
COPY apps/backend ./apps/backend

# Copy the packages
COPY packages/@uaguape/common ./packages/@uaguape/common
COPY packages/@uaguape/db ./packages/@uaguape/db
COPY packages/@uaguape/linking ./packages/@uaguape/linking
COPY packages/@uaguape/routes ./packages/@uaguape/routes

# Install monorepo dependencies (including backend dependencies)
RUN yarn install --frozen-lockfile

# Increase the memory limit for the build process
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Build the backend app
RUN yarn workspace backend build

# Build the packages
RUN yarn workspace @uaguape/common build
RUN yarn workspace @uaguape/db build
RUN yarn workspace @uaguape/linking build
RUN yarn workspace @uaguape/routes build

# Stage 2: Production image
FROM node:23-alpine

WORKDIR /app

# Copy the built monorepo
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/yarn.lock /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

WORKDIR /app/packages/@uaguape/db
# Install openssl3 for Prisma and symlink libssl.so.3 to /lib - Generate Prisma client
RUN apk add --no-cache openssl3 && ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3 && npx prisma generate

WORKDIR /app

CMD ["yarn", "workspace", "backend", "start:prod"]