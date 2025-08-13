# 🚀 Instalação Rápida - Sistema de Texto Rolante

## ⚡ Setup em 5 Minutos

### 1. Clone e Instale
```bash
git clone <seu-repositorio>
cd sistema-texto-rolante
npm install
```

### 2. Configure o Banco
```bash
# Crie um arquivo .env.local
echo 'DATABASE_URL="postgresql://username:password@localhost:5432/texto_rolante"' > .env.local
echo 'NEXTAUTH_SECRET="sua-chave-secreta-aqui"' >> .env.local
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env.local
```

### 3. Inicialize o Sistema
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Execute
```bash
npm run dev
```

### 5. Acesse
- **Login**: http://localhost:3000/login
- **Admin**: admin@textorolante.com / admin123
- **TV Display**: http://localhost:3000/display

## 🎯 Funcionalidades Principais

✅ **Login Seguro** - NextAuth com senha criptografada  
✅ **Painel Admin** - Gestão completa de usuários e frases  
✅ **Drag & Drop** - Reordenação intuitiva das frases  
✅ **Texto Rolante** - Animação suave e responsiva  
✅ **Configurações** - Controle de velocidade  
✅ **Design Clean** - Interface minimalista estilo Google  

## 🚀 Deploy no Railway

1. **Conecte o repositório** no Railway
2. **Adicione PostgreSQL** como serviço
3. **Configure as variáveis** de ambiente
4. **Deploy automático** a cada push

## 📱 URLs do Sistema

- **Login**: `/login` - Autenticação de usuários
- **Dashboard**: `/dashboard` - Painel administrativo
- **Display**: `/display` - Exibição para TV
- **API**: `/api/*` - Endpoints do sistema

## 🔐 Usuários Padrão

| Email | Senha | Tipo |
|-------|-------|------|
| admin@textorolante.com | admin123 | Administrador |

## 🛠️ Comandos Úteis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Produção
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Sincronizar banco
npm run db:seed      # Dados iniciais
npm run db:studio    # Interface do banco
```

## 🎨 Personalização

- **Cores**: Edite `tailwind.config.js`
- **Estilos**: Modifique `src/app/globals.css`
- **Animações**: Ajuste `src/components/ScrollingText.tsx`
- **Configurações**: Use o painel administrativo

## 🐛 Problemas Comuns

### Erro de Conexão
```bash
# Verifique se o PostgreSQL está rodando
# Confirme DATABASE_URL no .env.local
```

### Erro de Build
```bash
# Gere o cliente Prisma primeiro
npm run db:generate
```

### Erro de Autenticação
```bash
# Verifique NEXTAUTH_SECRET e NEXTAUTH_URL
# Limpe o cache do navegador
```

## 📚 Documentação Completa

- **README.md** - Documentação completa
- **RAILWAY_DEPLOY.md** - Guia de deploy no Railway
- **prisma/railway-setup.md** - Configuração do banco

## 🎉 Pronto!

Seu Sistema de Texto Rolante está funcionando! 

**Próximos passos:**
1. Altere a senha do admin
2. Adicione suas frases
3. Configure a velocidade
4. Teste em diferentes dispositivos
5. Faça deploy no Railway

---

**🚀 Sistema funcionando perfeitamente!**
