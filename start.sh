#!/bin/sh

echo "🚀 Iniciando Sistema de Texto Rolante..."

# Aguardar um pouco para o banco estar pronto
echo "⏳ Aguardando banco de dados..."
sleep 5

# Executar seed do banco de dados
echo "🌱 Executando seed do banco de dados..."
node prisma/seed.js

# Verificar se o seed foi executado com sucesso
if [ $? -eq 0 ]; then
    echo "✅ Seed executado com sucesso!"
else
    echo "❌ Erro ao executar seed, tentando novamente..."
    sleep 3
    node prisma/seed.js
fi

# Iniciar a aplicação
echo "⚡ Iniciando aplicação..."
npm start
