FROM node:20-alpine

# Install Docker CLI for spawning sibling sandbox containers
RUN apk add --no-cache docker-cli

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]
