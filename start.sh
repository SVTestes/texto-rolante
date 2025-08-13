#!/bin/sh

echo "🚀 Iniciando Sistema de Texto Rolante..."

# Executar seed do banco de dados
echo "🌱 Executando seed do banco de dados..."
node prisma/seed.js

# Iniciar a aplicação
echo "⚡ Iniciando aplicação..."
npm start
