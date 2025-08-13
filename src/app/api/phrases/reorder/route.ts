import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { phraseIds } = await request.json()
    
    if (!Array.isArray(phraseIds) || phraseIds.length === 0) {
      return NextResponse.json({ error: 'Lista de IDs de frases é obrigatória' }, { status: 400 })
    }

    // Atualizar a ordem de todas as frases
    const updates = phraseIds.map((id: string, index: number) => 
      prisma.phrase.update({
        where: { id },
        data: { order: index + 1 },
      })
    )

    await prisma.$transaction(updates)

    return NextResponse.json({ message: 'Ordem das frases atualizada com sucesso' })
  } catch (error) {
    console.error('Erro ao reordenar frases:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
