import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdOrThrow } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const userId = getUserIdOrThrow();
  const id = params.id;
  const c = await prisma.card.findFirst({
    where: { id, ownerId: userId },
    select: { id: true, title: true, percentBand: true, situation: true, oppMove: true, answerMD: true, tags: { select: { tag: { select: { name: true } } } } },
  });
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({
    id: c.id,
    title: c.title,
    percentBand: c.percentBand,
    situation: c.situation,
    oppMove: c.oppMove,
    answerMD: c.answerMD,
    tags: c.tags.map((t) => t.tag.name),
  });
}
