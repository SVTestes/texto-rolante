import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const phrases = await prisma.phrase.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(phrases)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'Missing text field' }, { status: 400 })
    }

    // Get the highest order number and add 1
    const lastPhrase = await prisma.phrase.findFirst({
      orderBy: { order: 'desc' }
    })
    
    const newOrder = (lastPhrase?.order || 0) + 1

    const phrase = await prisma.phrase.create({
      data: {
        text,
        order: newOrder
      }
    })

    return NextResponse.json(phrase)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
