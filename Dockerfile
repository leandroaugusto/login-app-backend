ARG NODE_VERSION=20.10.0
# Use the Node.js official image
FROM node:${NODE_VERSION}-alpine

# Create a work directory
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# RUN --mount=type=bind,source=package.json,target=package.json \
#   --mount=type=bind,source=package-lock.json,target=package-lock.json \
#   --mount=type=cache,target=/root/.npm \
#   npm ci --omit=dev

# Copy package.json, package-lock.json and .env files
COPY package*.json ./
COPY .env ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Copie o arquivo tsconfig.json
COPY tsconfig.json ./

# Compile o código TypeScript
RUN npx tsc

# Exponha a porta que a aplicação vai rodar
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]
