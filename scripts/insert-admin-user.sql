-- Script para inserir usuário admin diretamente no banco
-- Execute este script no terminal SQL do Railway

-- Primeiro, deletar usuário admin existente (se houver)
DELETE FROM "user" WHERE "email" = 'admin@textorolante.com';

-- Inserir novo usuário admin com senha 'admin123' já hasheada
-- Esta senha foi gerada com bcrypt.hash('admin123', 12)
INSERT INTO "user" ("id", "email", "name", "password", "isadmin", "createdat", "updatedat") 
VALUES (
  'admin-1',
  'admin@textorolante.com',
  'Administrador',
  '$2a$12$21Q9rW3cBwG81a4G..Fyg.ELr6HsOUsHPXg2oo80fd6wObDsOaJma',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Verificar se foi inserido corretamente
SELECT "id", "email", "name", "isadmin", "createdat", "updatedat" FROM "user" WHERE "email" = 'admin@textorolante.com';

-- Mostrar todos os usuários para confirmação
SELECT "id", "email", "name", "isadmin", "createdat", "updatedat" FROM "user";
