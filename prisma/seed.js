const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  try {
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@textorolante.com' },
      update: {},
      create: {
        email: 'admin@textorolante.com',
        name: 'Administrador',
        password: hashedPassword,
        isAdmin: true,
      },
    })

    console.log('✅ Usuário admin criado:', adminUser.email)
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error)
  }

  // Create default settings
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        scrollSpeed: 50,
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
          isActive: true,
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
