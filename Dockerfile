FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY server ./server
COPY public ./public

ENV DATA_DIR=/data
ENV PORT=3000
VOLUME ["/data"]

EXPOSE 3000
CMD ["node", "server/index.js"]
