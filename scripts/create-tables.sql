-- Script para criar as tabelas manualmente no PostgreSQL
-- Execute este script diretamente no banco do Railway

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Tabela de frases
CREATE TABLE IF NOT EXISTS "Phrase" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Phrase_pkey" PRIMARY KEY ("id")
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS "Settings" (
    "id" TEXT NOT NULL,
    "scrollSpeed" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- Índices únicos
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Phrase_order_key" ON "Phrase"("order");

-- Inserir configurações padrão
INSERT INTO "Settings" ("id", "scrollSpeed", "createdAt", "updatedAt")
VALUES ('default', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Inserir frases de exemplo
INSERT INTO "Phrase" ("id", "text", "order", "isActive", "createdAt", "updatedAt")
VALUES 
    ('sample-1', 'Bem-vindo ao Sistema de Texto Rolante', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sample-2', 'Este é um sistema completo para gerenciamento de mensagens', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sample-3', 'Configure a velocidade e adicione suas próprias frases', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sample-4', 'Sistema desenvolvido com Next.js e Prisma', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('sample-5', 'Perfeito para exibição em TVs e monitores', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Inserir usuário admin (senha: admin123)
INSERT INTO "User" ("id", "email", "name", "password", "isAdmin", "createdAt", "updatedAt")
VALUES (
    'admin-1',
    'admin@textorolante.com',
    'Administrador',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8e',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;
