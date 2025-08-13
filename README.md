# Sistema de Texto Rolante

Um sistema completo para gerenciamento e exibição de texto rolante em TVs, desenvolvido com Next.js, Prisma e PostgreSQL.

## 🚀 Funcionalidades

- **Sistema de Autenticação**: Login seguro com NextAuth
- **Painel Administrativo**: Interface completa para gerenciamento
- **Gestão de Usuários**: Criação, edição e exclusão de usuários (apenas para admins)
- **Gestão de Frases**: Adição, edição, exclusão e reordenação de frases
- **Drag & Drop**: Reordenação intuitiva das frases
- **Configurações**: Controle da velocidade do texto rolante
- **Exibição em TV**: Interface otimizada para exibição em telas grandes
- **Design Responsivo**: Interface limpa e minimalista estilo Google

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **Estilização**: Tailwind CSS
- **Animações**: CSS Animations + React Beautiful DnD
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd sistema-texto-rolante
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/texto_rolante"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configure o banco de dados
```bash
# Gere o cliente Prisma
npx prisma generate

# Execute as migrações
npx prisma db push

# Inicialize o banco com dados padrão
node scripts/init-db.js
```

### 5. Execute o projeto
```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 🔐 Acesso Inicial

Após a inicialização, você terá acesso com:

- **Email**: `admin@textorolante.com`
- **Senha**: `admin123`

**⚠️ IMPORTANTE**: Altere a senha do admin após o primeiro login!

## 📱 Como Usar

### Painel Administrativo (`/dashboard`)
- **Gestão de Frases**: Adicione, edite, delete e reordene frases
- **Gestão de Usuários**: Crie e gerencie usuários (apenas para admins)
- **Configurações**: Ajuste a velocidade do texto rolante

### Exibição em TV (`/display`)
- Interface limpa e otimizada para exibição em telas grandes
- Texto rolante contínuo com separadores visuais
- Responsivo para diferentes resoluções de TV

## 🚀 Deploy no Railway

### 1. Conecte seu repositório ao Railway
- Crie uma conta no [Railway](https://railway.app)
- Conecte seu repositório GitHub

### 2. Configure as variáveis de ambiente
No painel do Railway, configure:

```env
DATABASE_URL="sua-url-do-postgresql"
NEXTAUTH_SECRET="chave-secreta-aleatoria"
NEXTAUTH_URL="https://seu-app.railway.app"
```

### 3. Deploy automático
O Railway fará o deploy automático sempre que você fizer push para a branch principal.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # APIs do sistema
│   ├── dashboard/         # Painel administrativo
│   ├── display/           # Exibição do texto rolante
│   └── login/             # Página de login
├── components/            # Componentes React
│   ├── Dashboard.tsx      # Painel principal
│   ├── PhraseManagement.tsx # Gestão de frases
│   ├── UserManagement.tsx # Gestão de usuários
│   ├── ScrollingText.tsx  # Texto rolante
│   └── ...
└── lib/                   # Utilitários e configurações
    ├── prisma.ts          # Cliente Prisma
    └── auth.ts            # Configuração NextAuth
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento local
npm run build        # Build de produção
npm run start        # Iniciar em produção
npm run lint         # Verificar código
```

## 🎨 Personalização

### Cores e Estilo
- Edite `tailwind.config.js` para personalizar cores
- Modifique `src/app/globals.css` para estilos globais

### Animações
- Ajuste a velocidade no painel de configurações
- Modifique `src/components/ScrollingText.tsx` para animações personalizadas

## 🐛 Troubleshooting

### Problemas comuns:

1. **Erro de conexão com banco**
   - Verifique se o PostgreSQL está rodando
   - Confirme a URL de conexão no `.env.local`

2. **Erro de autenticação**
   - Verifique se `NEXTAUTH_SECRET` está configurado
   - Confirme se `NEXTAUTH_URL` está correto

3. **Erro de build**
   - Execute `npx prisma generate` antes do build
   - Verifique se todas as dependências estão instaladas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, abra uma issue no repositório ou entre em contato através do painel administrativo.

---

**Desenvolvido com ❤️ para facilitar a comunicação através de texto rolante**
