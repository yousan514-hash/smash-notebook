import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deckId = searchParams.get('deckId')
    const ownerId = searchParams.get('ownerId')

    const where: any = {}
    if (deckId) where.deckId = deckId
    if (ownerId) where.ownerId = ownerId

    const cards = await prisma.card.findMany({
      where,
      include: {
        deck: true,
        owner: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Failed to fetch cards:', error)
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      deckId, 
      title, 
      question, 
      answerMD, 
      percentBand, 
      situation, 
      oppChar, 
      oppMove, 
      tags, 
      ownerId 
    } = await request.json()

    if (!deckId || !title || !question || !answerMD || !ownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const card = await prisma.card.create({
      data: {
        deckId,
        title,
        question,
        answerMD,
        percentBand: percentBand || null,
        situation: situation || null,
        oppChar: oppChar || null,
        oppMove: oppMove || null,
        tags: tags || [],
        ownerId
      }
    })

    return NextResponse.json(card)
  } catch (error) {
    console.error('Failed to create card:', error)
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
  }
}