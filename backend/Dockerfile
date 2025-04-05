# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy source code
COPY . .

# 5. (Optional) Build TypeScript
# RUN npm run build

# 6. Expose application port
EXPOSE 4000

# 7. Set environment variable
ENV NODE_ENV=production

# 8. Start the application using ts-node
CMD ["npx", "ts-node", "src/index.ts"]
