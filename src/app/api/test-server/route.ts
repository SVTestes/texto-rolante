import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      server: 'running',
      timestamp: new Date().toISOString(),
      message: 'Servidor Next.js está funcionando corretamente',
      version: '1.0.0'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
