# resources-app — backend (express, generated scaffold)
FROM node:20.19.2-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

USER node

CMD ["node", "src/server.js"]
