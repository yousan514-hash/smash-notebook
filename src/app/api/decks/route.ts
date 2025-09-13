import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const decks = await prisma.deck.findMany({
      where: { ownerId: 'seed-user' },
      include: {
        _count: {
          select: { cards: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(decks)
  } catch (error) {
    console.error('Failed to fetch decks:', error)
    return NextResponse.json([], { status: 500 })
  }
}