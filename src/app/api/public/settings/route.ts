import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'default' },
    })

    if (!settings) {
      // Retornar configurações padrão se não existirem
      return NextResponse.json({ scrollspeed: 1 })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    // Retornar configurações padrão em caso de erro
    return NextResponse.json({ scrollspeed: 1 })
  }
}
