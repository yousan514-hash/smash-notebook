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
    const { content, tags, isPublic } = body

    const post = await prisma.post.create({
      data: {
        ownerId: profile.id,
        content,
        tags: tags || [],
        isPublic: isPublic !== false, // デフォルトはtrue
      },
      include: {
        owner: true,
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

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}