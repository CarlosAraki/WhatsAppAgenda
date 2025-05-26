# Use a imagem ARM64 do Node
FROM --platform=linux/arm64 node:21

# Instale as dependências corretas para ARM64
RUN apt-get update && \
    apt-get install -y \
    wget \
    gnupg \
    xvfb \
    chromium \
    libgbm-dev \
    libxshmfence-dev \
    libnss3-dev \
    libgtk-3-0 \
    libasound2 \
    dbus-x11 \
    && rm -rf /var/lib/apt/lists/*

# Configure o ambiente
ENV DISPLAY=:99
ENV CHROME_BIN=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /usr/src/app

# Inicie o X virtual framebuffer em background
RUN nohup Xvfb :99 -screen 0 1024x768x16 &

COPY . .

RUN npm install

EXPOSE 4001

CMD ["npm", "start"]