const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function setupDatabase() {
  console.log('🔧 Configurando banco de dados...')
  
  try {
    // 1. Verificar conexão
    console.log('📡 Testando conexão com o banco...')
    await prisma.$connect()
    console.log('✅ Conectado ao banco de dados')
    
    // 2. Executar migrações
    console.log('🔧 Executando migrações...')
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' })
      console.log('✅ Migrações executadas com sucesso')
    } catch (error) {
      console.log('⚠️ Erro ao executar migrações, tentando criar schema...')
      try {
        execSync('npx prisma db push', { stdio: 'inherit' })
        console.log('✅ Schema criado com sucesso')
      } catch (pushError) {
        console.error('❌ Erro ao criar schema:', pushError.message)
        throw pushError
      }
    }
    
    // 3. Verificar se as tabelas existem
    console.log('🔍 Verificando tabelas...')
    const userCount = await prisma.user.count()
    const phraseCount = await prisma.phrase.count()
    const settingsCount = await prisma.settings.count()
    
    console.log(`📊 Tabelas encontradas:`)
    console.log(`   - User: ${userCount} registros`)
    console.log(`   - Phrase: ${phraseCount} registros`)
    console.log(`   - Settings: ${settingsCount} registros`)
    
    console.log('🎉 Banco de dados configurado com sucesso!')
    
  } catch (error) {
    console.error('💥 Erro ao configurar banco:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup concluído!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Setup falhou:', error)
      process.exit(1)
    })
}

module.exports = { setupDatabase }
