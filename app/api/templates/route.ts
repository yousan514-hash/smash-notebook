import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetChar = searchParams.get('targetChar')

    const where: any = {}
    if (targetChar) {
      where.targetChar = targetChar
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: [
        { percent: 'asc' },
        { section: 'asc' },
      ],
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}