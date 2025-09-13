import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
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

    const decks = await prisma.deck.findMany({
      where: { ownerId: profile.id },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(decks)
  } catch (error) {
    console.error('Error fetching decks:', error)
    return NextResponse.json({ error: 'Failed to fetch decks' }, { status: 500 })
  }
}