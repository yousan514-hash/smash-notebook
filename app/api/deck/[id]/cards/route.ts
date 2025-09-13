import { prisma } from '@/lib/prisma';
import { getUserIdOrThrow } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdOrThrow();
  const body = await req.json();
  const items: Array<{ title: string; percent: number; section?: string; oppMove?: string; answerMD?: string; tags?: string[] }> = body?.items || [];
  const deckId = params.id;

  // minimal mapping
  const created = await prisma.$transaction(
    items.map((it) =>
      prisma.card.create({
        data: {
          deckId,
          ownerId: userId,
          title: it.title,
          percentBand: it.percent ?? 0,
          situation: 'NEUTRAL',
          oppMove: it.oppMove,
          answerMD: it.answerMD,
          tags: it.tags && it.tags.length ? {
            create: it.tags.map((t) => ({ tag: { connectOrCreate: { where: { ownerId_name: { ownerId: userId, name: t } }, create: { ownerId: userId, name: t } } } }))
          } : undefined,
        },
        select: { id: true },
      })
    )
  );
  return NextResponse.json({ ok: true, ids: created.map((c) => c.id) });
}
