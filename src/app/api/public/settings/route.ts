import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'default' },
    })

    if (!settings) {
      console.log('⚠️ Public Settings - Configurações não encontradas, retornando padrão')
      // Retornar configurações padrão se não existirem
      return NextResponse.json({ scrollspeed: 1 })
    }

    console.log('🌐 Public Settings - Retornando:', settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações públicas:', error)
    // Retornar configurações padrão em caso de erro
    return NextResponse.json({ scrollspeed: 1 })
  }
}
