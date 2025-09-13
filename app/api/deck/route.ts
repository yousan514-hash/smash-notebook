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
    const { title, description, targetChar, isPublic } = body

    const deck = await prisma.deck.create({
      data: {
        ownerId: profile.id,
        title,
        description,
        targetChar,
        isPublic: isPublic || false,
      },
    })

    return NextResponse.json(deck)
  } catch (error) {
    console.error('Error creating deck:', error)
    return NextResponse.json({ error: 'Failed to create deck' }, { status: 500 })
  }
}