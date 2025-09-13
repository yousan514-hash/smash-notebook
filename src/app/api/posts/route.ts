import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            displayName: true,
            handle: true
          }
        },
        linkedCard: {
          select: {
            id: true,
            myChar: true,
            oppChar: true,
            percentBand: true,
            situation: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // 最新50件まで
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { body, linkedCardId } = await request.json()

    if (!body?.trim()) {
      return NextResponse.json({ error: 'Body is required' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        body: body.trim(),
        authorId: 'seed-user', // 固定ユーザー
        linkedCardId: linkedCardId || null,
        mediaUrls: [],
        tags: []
      },
      include: {
        author: {
          select: {
            displayName: true,
            handle: true
          }
        },
        linkedCard: {
          select: {
            id: true,
            myChar: true,
            oppChar: true,
            percentBand: true,
            situation: true
          }
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}