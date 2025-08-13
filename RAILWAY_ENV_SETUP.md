# 🚀 Configuração de Variáveis de Ambiente no Railway

## 📋 Variáveis Obrigatórias

Para o sistema funcionar corretamente, você **DEVE** configurar estas variáveis no Railway:

### 🔐 **DATABASE_URL** (OBRIGATÓRIA)
```
postgresql://username:password@host:port/database
```

**Exemplo:**
```
postgresql://postgres:password123@containers-us-west-1.railway.app:5432/railway
```

### 🔑 **NEXTAUTH_SECRET** (OBRIGATÓRIA)
```
qualquer_string_aleatoria_muito_longa_e_segura
```

**Exemplo:**
```
my-super-secret-key-123456789-abcdef-xyz-railway-2024
```

### 🌐 **NEXTAUTH_URL** (OBRIGATÓRIA)
```
https://seu-dominio.railway.app
```

**Exemplo:**
```
https://texto-rolante-production-1234.up.railway.app
```

## 📝 Como Configurar no Railway

### **Passo 1: Acesse o Dashboard**
1. Vá para [railway.app](https://railway.app)
2. Faça login na sua conta
3. Clique no projeto "texto-rolante"

### **Passo 2: Configure as Variáveis**
1. Clique na aba **"Variables"**
2. Clique em **"New Variable"**
3. Adicione cada variável:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `DATABASE_URL` | `postgresql://...` | URL do banco PostgreSQL |
| `NEXTAUTH_SECRET` | `string_aleatoria` | Chave secreta para autenticação |
| `NEXTAUTH_URL` | `https://...` | URL da aplicação |

### **Passo 3: Deploy**
1. Após configurar as variáveis
2. Faça um novo deploy
3. O seed será executado automaticamente

## 🔍 Verificar se Está Funcionando

### **Logs do Deploy:**
```
🚀 Iniciando Sistema de Texto Rolante...
⏳ Aguardando banco de dados...
🌱 Executando seed do banco de dados...
✅ Conectado ao banco de dados
✅ Banco de dados está funcionando
✅ Usuário admin criado: admin@textorolante.com
✅ Configurações padrão criadas
✅ Frases de exemplo criadas
🎉 Seed concluído com sucesso!
✅ Seed executado com sucesso!
⚡ Iniciando aplicação...
```

### **Teste de Login:**
- **Email:** `admin@textorolante.com`
- **Senha:** `admin123`

## ❌ Problemas Comuns

### **Erro: "Credenciais inválidas"**
- ✅ Verifique se `DATABASE_URL` está configurada
- ✅ Verifique se `NEXTAUTH_SECRET` está configurada
- ✅ Verifique se `NEXTAUTH_URL` está configurada
- ✅ Verifique se o banco PostgreSQL está ativo

### **Erro: "Cannot connect to database"**
- ✅ Verifique se `DATABASE_URL` está correta
- ✅ Verifique se o banco está rodando
- ✅ Aguarde alguns minutos após criar o banco

### **Erro: "NextAuth configuration error"**
- ✅ Verifique se `NEXTAUTH_SECRET` está configurada
- ✅ Verifique se `NEXTAUTH_URL` está correta

## 🆘 Suporte

Se ainda houver problemas:
1. Verifique os logs do Railway
2. Confirme se todas as variáveis estão configuradas
3. Aguarde alguns minutos após o deploy
4. Tente fazer um novo deploy
