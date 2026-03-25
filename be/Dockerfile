FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install deps
RUN npm install

# Copy source code
COPY . .

# Prisma
RUN npx prisma generate

# Build NestJS
RUN npm run build

# Expose port
EXPOSE 3000

# Start app + migrate
CMD sh -c "npx prisma migrate deploy && node dist/main.js"