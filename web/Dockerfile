###### Phase 1. Install Dependencies ######
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install



###### Phase 2. Build Project ######
FROM node:18-alpine AS builder
WORKDIR /app
# COPY "node_modules" from Phase 1
COPY --from=deps /app/node_modules ./node_modules
# COPY all code from project
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Official Environment
ENV NODE_ENV=production
# Compile. Generate "./next"
RUN npm run build



###### 3. Environment Operation ######
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Only COPY the file(code) in official environment
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/content ./content
COPY --from=builder /app/i18n.js ./i18n.js

# Port
EXPOSE 3000

# Start Next.js project
CMD ["npm", "start"]
