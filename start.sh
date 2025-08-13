#!/bin/sh

echo "🚀 Iniciando Sistema de Texto Rolante..."

# Aguardar um pouco para o banco estar pronto
echo "⏳ Aguardando banco de dados..."
sleep 5

# Configurar banco de dados (migrações + seed)
echo "🔧 Configurando banco de dados..."
node scripts/setup-db.js

# Verificar se o setup foi executado com sucesso
if [ $? -eq 0 ]; then
    echo "✅ Banco configurado com sucesso!"
else
    echo "❌ Erro ao configurar banco, tentando novamente..."
    sleep 3
    node scripts/setup-db.js
fi

# Iniciar a aplicação
echo "⚡ Iniciando aplicação..."
npm start
