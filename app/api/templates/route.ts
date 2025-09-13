import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetChar = searchParams.get('targetChar')
    const section = searchParams.get('section')

    const where: any = {}
    if (targetChar) where.targetChar = targetChar
    if (section) where.section = section

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Failed to fetch templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, targetChar, section, percent, oppMove, answerMD, ownerId } = await request.json()

    if (!title || !targetChar || !section || !percent || !answerMD || !ownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const template = await prisma.template.create({
      data: {
        title,
        targetChar,
        section,
        percent,
        oppMove: oppMove || null,
        answerMD,
        ownerId
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Failed to create template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}