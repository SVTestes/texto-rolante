import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const phrases = await prisma.phrase.findMany({
      where: { isactive: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(phrases)
  } catch (error) {
    console.error('Erro ao buscar frases:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { text } = await request.json()
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Texto é obrigatório' }, { status: 400 })
    }

    // Pegar a maior ordem atual
    const maxOrder = await prisma.phrase.aggregate({
      _max: { order: true }
    })
    
    const newOrder = (maxOrder._max.order || 0) + 1

    const phrase = await prisma.phrase.create({
      data: {
        text: text.trim(),
        order: newOrder,
        isactive: true,
      },
    })

    return NextResponse.json(phrase, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar frase:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
