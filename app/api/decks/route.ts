import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const isPublic = searchParams.get('isPublic')

    const where: any = {}
    if (ownerId) where.ownerId = ownerId
    if (isPublic !== null) where.isPublic = isPublic === 'true'

    const decks = await prisma.deck.findMany({
      where,
      include: {
        owner: true,
        cards: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { cards: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(decks)
  } catch (error) {
    console.error('Failed to fetch decks:', error)
    return NextResponse.json({ error: 'Failed to fetch decks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, character, isPublic, ownerId } = await request.json()

    if (!title || !character || !ownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const deck = await prisma.deck.create({
      data: {
        title,
        description: description || null,
        character,
        isPublic: isPublic || false,
        ownerId
      }
    })

    return NextResponse.json(deck)
  } catch (error) {
    console.error('Failed to create deck:', error)
    return NextResponse.json({ error: 'Failed to create deck' }, { status: 500 })
  }
}