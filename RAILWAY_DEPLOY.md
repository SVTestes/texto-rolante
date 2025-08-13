# 🚀 Deploy no Railway - Sistema de Texto Rolante

Este guia detalha como fazer o deploy do Sistema de Texto Rolante no Railway.

## 📋 Pré-requisitos

1. Conta no [Railway](https://railway.app)
2. Repositório GitHub com o código
3. Cartão de crédito para Railway (gratuito para projetos pequenos)

## 🚀 Passo a Passo

### 1. Conecte seu Repositório

1. Acesse [railway.app](https://railway.app)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha o repositório do Sistema de Texto Rolante
6. Clique em "Deploy Now"

### 2. Configure o Banco de Dados

1. No projeto criado, clique em "New"
2. Selecione "Database" → "PostgreSQL"
3. Aguarde a criação do banco
4. Clique no banco criado e vá em "Connect"
5. Copie a variável `DATABASE_URL`

### 3. Configure as Variáveis de Ambiente

1. No seu projeto principal, vá em "Variables"
2. Adicione as seguintes variáveis:

```env
DATABASE_URL=sua-url-do-postgresql-aqui
NEXTAUTH_SECRET=chave-secreta-aleatoria-de-32-caracteres
NEXTAUTH_URL=https://seu-app.railway.app
```

**⚠️ IMPORTANTE**: 
- `NEXTAUTH_SECRET` deve ser uma string aleatória de pelo menos 32 caracteres
- `NEXTAUTH_URL` deve ser a URL do seu app no Railway

### 4. Configure o Build

1. Vá em "Settings" do seu projeto
2. Em "Build Command", configure:
   ```bash
   npm run build
   ```
3. Em "Start Command", configure:
   ```bash
   npm start
   ```

### 5. Execute o Seed do Banco

1. No terminal do Railway ou via GitHub Actions, execute:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

### 6. Verifique o Deploy

1. Aguarde o build e deploy automático
2. Acesse a URL fornecida pelo Railway
3. Teste o login com as credenciais padrão:
   - **Email**: `admin@textorolante.com`
   - **Senha**: `admin123`

## 🔧 Configurações Avançadas

### Domínio Personalizado

1. Vá em "Settings" → "Domains"
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruções

### Variáveis de Ambiente Adicionais

```env
# Para produção
NODE_ENV=production
# Para logs detalhados
DEBUG=prisma:*
# Para cache
REDIS_URL=sua-url-redis
```

### Health Check

O Railway configurado automaticamente:
- **Path**: `/`
- **Timeout**: 300s
- **Restart Policy**: On Failure

## 🐛 Troubleshooting

### Erro de Build

```bash
# Verifique se todas as dependências estão instaladas
npm install
# Gere o cliente Prisma
npm run db:generate
# Teste o build localmente
npm run build
```

### Erro de Conexão com Banco

1. Verifique se `DATABASE_URL` está correto
2. Confirme se o banco PostgreSQL está ativo
3. Teste a conexão localmente

### Erro de Autenticação

1. Verifique se `NEXTAUTH_SECRET` está configurado
2. Confirme se `NEXTAUTH_URL` está correto
3. Limpe o cache do navegador

## 📊 Monitoramento

### Logs
- Acesse "Deployments" → "View Logs"
- Monitore erros e performance

### Métricas
- CPU e memória em tempo real
- Latência de resposta
- Uso de banco de dados

### Alertas
- Configure notificações para falhas
- Monitore uso de recursos

## 🔄 Deploy Automático

O Railway faz deploy automático sempre que:
- Você faz push para a branch principal
- Cria uma Pull Request
- Força um deploy manual

### Branch Protection

1. Configure branch protection no GitHub
2. Requira reviews antes do merge
3. Configure testes automáticos

## 💰 Custos

- **Gratuito**: $5 de crédito mensal
- **Pro**: $20/mês para projetos maiores
- **Enterprise**: Preços personalizados

### Otimizações de Custo

1. Use o plano gratuito para desenvolvimento
2. Escale apenas quando necessário
3. Monitore uso de recursos

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. **Altere a senha do admin**
2. **Configure frases personalizadas**
3. **Teste em diferentes dispositivos**
4. **Configure domínio personalizado**
5. **Implemente monitoramento**

## 📞 Suporte

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Discord**: [railway.app/discord](https://railway.app/discord)
- **GitHub Issues**: Para problemas específicos do projeto

---

**🚀 Seu Sistema de Texto Rolante está rodando no Railway!**
