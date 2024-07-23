# Use a imagem oficial do Node.js como base
FROM node:20

# Crie um diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos package.json e package-lock.json
COPY package*.json ./

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
