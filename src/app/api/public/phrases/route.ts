import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const phrases = await prisma.phrase.findMany({
      where: { isactive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        text: true,
        order: true,
      },
    })

    return NextResponse.json(phrases)
  } catch (error) {
    console.error('Erro ao buscar frases:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
