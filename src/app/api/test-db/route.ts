import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Testar conexão com o banco
    await prisma.$connect()
    
    // Verificar se existem usuários
    const userCount = await prisma.user.count()
    
    // Verificar se existem configurações
    const settingsCount = await prisma.settings.count()
    
    // Verificar se existem frases
    const phraseCount = await prisma.phrase.count()
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      users: userCount,
      settings: settingsCount,
      phrases: phraseCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao testar banco:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
