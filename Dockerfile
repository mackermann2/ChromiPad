FROM node:20-slim
RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 libxdamage1 \
    libxrandr2 libgbm1 libpango-1.0-0 libxshmfence1 libxss1 libasound2 libegl1 \
    wget curl ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npx playwright install chromium

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

