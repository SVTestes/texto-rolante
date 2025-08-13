# 🗄️ Configuração do Prisma no Railway

Este guia explica como configurar o Prisma para funcionar perfeitamente no Railway.

## 🚀 Setup Inicial

### 1. Instale as Dependências

```bash
npm install @prisma/client prisma
```

### 2. Gere o Cliente Prisma

```bash
npm run db:generate
```

### 3. Configure o Banco

```bash
npm run db:push
```

### 4. Execute o Seed

```bash
npm run db:seed
```

## 🔧 Configurações do Railway

### Variáveis de Ambiente Necessárias

```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="https://seu-app.railway.app"
```

### Estrutura do DATABASE_URL

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Exemplo:
```
postgresql://postgres:password123@containers-us-west-1.railway.app:5432/railway
```

## 📊 Comandos Úteis

### Desenvolvimento Local

```bash
# Gerar cliente
npm run db:generate

# Sincronizar schema
npm run db:push

# Executar seed
npm run db:seed

# Abrir Prisma Studio
npm run db:studio
```

### Produção (Railway)

```bash
# Build e deploy automático
git push origin main

# Verificar logs
railway logs

# Acessar terminal
railway shell
```

## 🐛 Troubleshooting

### Erro: "Prisma Client not found"

```bash
# Solução: Gere o cliente
npm run db:generate
```

### Erro: "Connection failed"

1. Verifique `DATABASE_URL`
2. Confirme se o banco está ativo
3. Teste a conexão

### Erro: "Schema validation failed"

```bash
# Sincronize o schema
npm run db:push
```

## 🔄 Migrações

### Desenvolvimento

```bash
# Criar migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações
npx prisma migrate deploy
```

### Produção

```bash
# Aplicar migrações existentes
npx prisma migrate deploy

# Reset (cuidado!)
npx prisma migrate reset
```

## 📱 Prisma Studio

### Local

```bash
npm run db:studio
```

### Railway (via port forwarding)

```bash
railway service
railway port 5555
```

## 🚀 Deploy Automático

O Railway executa automaticamente:

1. `npm install`
2. `npm run build`
3. `npm start`

### Pré-deploy (Opcional)

```bash
# Adicione ao package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

## 📊 Monitoramento

### Logs do Prisma

```env
DEBUG="prisma:*"
```

### Métricas

- Conexões ativas
- Queries executadas
- Tempo de resposta

## 🔒 Segurança

### Boas Práticas

1. **Nunca** commite `.env` files
2. Use variáveis de ambiente
3. Rotacione `NEXTAUTH_SECRET`
4. Monitore logs de acesso

### Variáveis Sensíveis

```env
# Nunca commite estas
DATABASE_URL=***
NEXTAUTH_SECRET=***
JWT_SECRET=***
```

## 📚 Recursos Adicionais

- [Prisma Docs](https://www.prisma.io/docs)
- [Railway Docs](https://docs.railway.app)
- [Next.js + Prisma](https://nextjs.org/docs/guides/database)

---

**🗄️ Prisma configurado e funcionando no Railway!**
