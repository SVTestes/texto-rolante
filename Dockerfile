# Dockerfile simplificado para Next.js
FROM node:18-alpine

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Configurar variáveis de ambiente
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Executar migrações do Prisma (criar schema)
RUN npx prisma migrate deploy

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3000

# Script de inicialização
COPY start.sh ./
RUN chmod +x start.sh
CMD ["./start.sh"]
