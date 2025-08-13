import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { phrases } = await request.json()
    
    if (!Array.isArray(phrases)) {
      return NextResponse.json({ error: 'Invalid phrases data' }, { status: 400 })
    }

    // Update all phrases with new order
    for (const phrase of phrases) {
      await prisma.phrase.update({
        where: { id: phrase.id },
        data: { order: phrase.order }
      })
    }

    return NextResponse.json({ message: 'Phrases reordered successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
