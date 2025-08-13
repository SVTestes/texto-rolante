import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst()
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: { scrollSpeed: 50 }
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { scrollSpeed } = await request.json()
    
    if (typeof scrollSpeed !== 'number' || scrollSpeed < 1 || scrollSpeed > 100) {
      return NextResponse.json({ error: 'Invalid scroll speed' }, { status: 400 })
    }

    let settings = await prisma.settings.findFirst()
    
    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: { scrollSpeed }
      })
    } else {
      settings = await prisma.settings.create({
        data: { scrollSpeed }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
