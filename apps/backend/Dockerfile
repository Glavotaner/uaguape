# Use a suitable base image
FROM node:18-alpine3.17 AS builder

WORKDIR /app

# Copy the monorepo root package.json and yarn.lock
COPY ../../package*.json ./
COPY ../../yarn.lock ./

# Install monorepo dependencies (including backend dependencies)
RUN yarn install --frozen-lockfile

# Copy the backend app's package.json and source code
COPY package*.json ./
COPY src/ ./src/

# Build the backend app
RUN yarn build

# Stage 2: Production image
FROM node:18-alpine3.17

WORKDIR /app

# Copy only the built backend app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./

# Install only production dependencies for the backend
RUN yarn install --production --frozen-lockfile

CMD ["node", "dist/main"]