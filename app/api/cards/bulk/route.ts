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
    const { deckId, templates } = body

    // デッキの所有権確認
    const deck = await prisma.deck.findUnique({
      where: { id: deckId }
    })

    if (!deck || deck.ownerId !== profile.id) {
      return NextResponse.json({ error: 'Deck not found or unauthorized' }, { status: 403 })
    }

    // バルクインサート
    const cards = await prisma.card.createMany({
      data: templates.map((template: any) => ({
        ownerId: profile.id,
        deckId,
        percentBand: template.percentBand,
        situation: template.situation,
        oppChar: template.oppChar || null,
        oppMove: template.oppMove || null,
        answerMD: template.answerMD,
        tags: template.tags || [],
      })),
    })

    // タグの正規化
    const allTags = [...new Set(templates.flatMap((t: any) => t.tags || []))]
    if (allTags.length > 0) {
      await Promise.all(
        allTags.map(tag =>
          prisma.tag.upsert({
            where: { name: tag },
            update: {},
            create: { name: tag, ownerId: profile.id },
          })
        )
      )
    }

    return NextResponse.json({ count: cards.count })
  } catch (error) {
    console.error('Error creating cards:', error)
    return NextResponse.json({ error: 'Failed to create cards' }, { status: 500 })
  }
}