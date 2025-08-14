// Script para gerar hash da senha admin123
// Execute: node scripts/generate-password-hash.js

const bcrypt = require('bcryptjs')

async function generateHash() {
  const password = 'admin123'
  const saltRounds = 12
  
  try {
    const hash = await bcrypt.hash(password, saltRounds)
    
    console.log('🔑 Hash da senha gerado com sucesso!')
    console.log('📧 Email: admin@textorolante.com')
    console.log('🔑 Senha: admin123')
    console.log('🔐 Hash gerado:')
    console.log(hash)
    console.log('\n📋 Use este hash no script SQL:')
    console.log(`INSERT INTO "user" ("id", "email", "name", "password", "isadmin", "createdat", "updatedat") VALUES ('admin-1', 'admin@textorolante.com', 'Administrador', '${hash}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`)
    
  } catch (error) {
    console.error('❌ Erro ao gerar hash:', error)
  }
}

generateHash()
