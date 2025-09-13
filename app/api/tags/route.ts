import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    
    return NextResponse.json(tags)
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category } = await request.json()
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 })
    }

    // Try to create or find existing tag
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: {
        name: name.trim(),
        category: category || null
      }
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Failed to create tag:', error)
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}