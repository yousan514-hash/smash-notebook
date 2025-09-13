import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, context: Context) {
  try {
    const { id } = await context.params
    
    const deck = await prisma.deck.findUnique({
      where: { id },
      include: {
        cards: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    return NextResponse.json(deck)
  } catch (error) {
    console.error('Failed to fetch deck:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}