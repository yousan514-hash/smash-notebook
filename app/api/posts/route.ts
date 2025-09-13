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

    const posts = await prisma.post.findMany({
      where,
      include: {
        owner: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, isPublic, ownerId } = await request.json()

    if (!title || !content || !ownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        isPublic: isPublic || false,
        ownerId
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}