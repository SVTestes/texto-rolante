const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function setupDatabase() {
  console.log('🔧 Configurando banco de dados...')
  
  try {
    // 1. Verificar variáveis de ambiente
    console.log('🔍 Verificando variáveis de ambiente...')
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não está definida')
    }
    console.log('✅ DATABASE_URL configurada')
    
    // 2. Verificar conexão
    console.log('📡 Testando conexão com o banco...')
    await prisma.$connect()
    console.log('✅ Conectado ao banco de dados')
    
    // 3. Tentar criar schema (mais confiável que migrações)
    console.log('🔧 Criando schema do banco...')
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
      console.log('✅ Schema criado com sucesso')
    } catch (error) {
      console.log('⚠️ Erro ao criar schema, tentando migrações...')
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' })
        console.log('✅ Migrações executadas com sucesso')
      } catch (migrateError) {
        console.error('❌ Erro ao executar migrações:', migrateError.message)
        throw migrateError
      }
    }
    
    // 4. Executar seed
    console.log('🌱 Executando seed do banco...')
    try {
      execSync('node prisma/seed.js', { stdio: 'inherit' })
      console.log('✅ Seed executado com sucesso')
    } catch (seedError) {
      console.error('❌ Erro ao executar seed:', seedError.message)
      throw seedError
    }
    
    // 5. Verificar se as tabelas existem
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
