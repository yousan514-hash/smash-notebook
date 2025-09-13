import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { deckId, percentBand, situation, oppChar, oppMove, answerMD, tags } = body

    // デッキの所有権確認
    const deck = await prisma.deck.findUnique({
      where: { id: deckId }
    })

    if (!deck || deck.ownerId !== profile.id) {
      return NextResponse.json({ error: 'Deck not found or unauthorized' }, { status: 403 })
    }

    const card = await prisma.card.create({
      data: {
        ownerId: profile.id,
        deckId,
        percentBand,
        situation,
        oppChar: oppChar || null,
        oppMove: oppMove || null,
        answerMD,
        tags: tags || [],
      },
    })

    // タグをTagテーブルに正規化
    if (tags && tags.length > 0) {
      const uniqueTags = [...new Set(tags)]
      await Promise.all(
        uniqueTags.map(tag =>
          prisma.tag.upsert({
            where: { name: tag },
            update: {},
            create: { name: tag, ownerId: profile.id },
          })
        )
      )
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error creating card:', error)
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
  }
}