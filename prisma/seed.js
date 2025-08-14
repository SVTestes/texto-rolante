const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Função para aguardar conexão com o banco
async function waitForDatabase() {
  let retries = 0
  const maxRetries = 10
  
  while (retries < maxRetries) {
    try {
      await prisma.$connect()
      console.log('✅ Conectado ao banco de dados')
      return true
    } catch (error) {
      retries++
      console.log(`⏳ Tentativa ${retries}/${maxRetries} de conexão com o banco...`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  throw new Error('❌ Não foi possível conectar ao banco de dados após várias tentativas')
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')
  console.log('🔍 Verificando variáveis de ambiente...')
  
  // Verificar variáveis de ambiente
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não está definida!')
    process.exit(1)
  }
  
  if (!process.env.NEXTAUTH_SECRET) {
    console.error('❌ NEXTAUTH_SECRET não está definida!')
    process.exit(1)
  }
  
  if (!process.env.NEXTAUTH_URL) {
    console.error('❌ NEXTAUTH_URL não está definida!')
    process.exit(1)
  }
  
  console.log('✅ Todas as variáveis de ambiente estão configuradas')
  console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ Não configurada')
  console.log('🔑 NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Configurada' : '❌ Não configurada')
  console.log('🌐 NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Configurada' : '❌ Não configurada')

  // Aguardar conexão com o banco
  await waitForDatabase()

  // Verificar se o banco está funcionando
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Banco de dados está funcionando')
  } catch (error) {
    console.error('❌ Erro ao testar banco de dados:', error)
    throw error
  }

  // Create admin user with FORCED password update
  const hashedPassword = await bcrypt.hash('admin123', 12)
  console.log('🔑 Senha hash gerada:', hashedPassword.substring(0, 20) + '...')
  
  try {
    // FORÇAR atualização da senha - deletar usuário existente e recriar
    console.log('🗑️ Deletando usuário admin existente...')
    await prisma.user.deleteMany({
      where: { email: 'admin@textorolante.com' }
    })
    
    console.log('✨ Criando novo usuário admin...')
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@textorolante.com',
        name: 'Administrador',
        password: hashedPassword,
        isadmin: true,
      },
    })

    console.log('✅ Usuário admin criado com sucesso:', adminUser.email)
    console.log('📊 Dados do usuário:', {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      isadmin: adminUser.isadmin,
      createdat: adminUser.createdat,
      updatedat: adminUser.updatedat
    })
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error)
    throw error
  }

  // Create default settings
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        scrollspeed: 50,
      },
    })

    console.log('✅ Configurações padrão criadas')
  } catch (error) {
    console.error('❌ Erro ao criar configurações:', error)
  }

  // Create sample phrases
  try {
    const samplePhrases = [
      'Bem-vindo ao Sistema de Texto Rolante',
      'Este é um sistema completo para gerenciamento de mensagens',
      'Configure a velocidade e adicione suas próprias frases',
      'Sistema desenvolvido com Next.js e Prisma',
      'Perfeito para exibição em TVs e monitores',
    ]

    for (let i = 0; i < samplePhrases.length; i++) {
      await prisma.phrase.upsert({
        where: { id: `sample-${i + 1}` },
        update: {},
        create: {
          id: `sample-${i + 1}`,
          text: samplePhrases[i],
          order: i + 1,
          isactive: true,
        },
      })
    }

    console.log('✅ Frases de exemplo criadas')
  } catch (error) {
    console.error('❌ Erro ao criar frases de exemplo:', error)
  }

  console.log('🎉 Seed concluído com sucesso!')
  console.log('📧 Login: admin@textorolante.com')
  console.log('🔑 Senha: admin123')
  console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!')
}

main()
  .catch((e) => {
    console.error('💥 Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
