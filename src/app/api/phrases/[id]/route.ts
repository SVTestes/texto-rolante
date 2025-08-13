import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { text, isactive } = await request.json()
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Texto é obrigatório' }, { status: 400 })
    }

    const phrase = await prisma.phrase.update({
      where: { id: params.id },
      data: {
        text: text.trim(),
        isactive: isactive !== undefined ? isactive : true,
      },
    })

    return NextResponse.json(phrase)
  } catch (error) {
    console.error('Erro ao atualizar frase:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await prisma.phrase.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Frase deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar frase:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
