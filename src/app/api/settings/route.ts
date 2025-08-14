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

    const settings = await prisma.settings.findUnique({
      where: { id: 'default' },
    })

    if (!settings) {
      return NextResponse.json({ error: 'Configurações não encontradas' }, { status: 404 })
    }

    console.log('🔍 GET Settings:', settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { scrollspeed } = await request.json()
    console.log('📝 PUT Settings - Nova velocidade:', scrollspeed)
    
    if (typeof scrollspeed !== 'number' || scrollspeed < 0.1 || scrollspeed > 10) {
      return NextResponse.json({ error: 'Velocidade deve ser um número entre 0.1 e 10' }, { status: 400 })
    }

    const settings = await prisma.settings.upsert({
      where: { id: 'default' },
      update: { scrollspeed },
      create: {
        id: 'default',
        scrollspeed,
      },
    })

    console.log('✅ Settings salvas:', settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
