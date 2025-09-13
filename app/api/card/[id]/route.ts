import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdOrThrow } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdOrThrow();
  const id = params.id;
  const body = await req.json();
  const { title, percentBand, situation, oppMove, answerMD, tags } = body as {
    title?: string;
    percentBand?: number;
    situation?: string;
    oppMove?: string | null;
    answerMD?: string | null;
    tags?: string[];
  };

  // Ensure ownership
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card || card.ownerId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.card.update({
      where: { id },
      data: {
        title: title ?? card.title,
        percentBand: typeof percentBand === 'number' ? percentBand : card.percentBand,
        situation: (situation as any) ?? card.situation,
        oppMove: oppMove === undefined ? card.oppMove : oppMove,
        answerMD: answerMD === undefined ? card.answerMD : answerMD,
      },
    });
    if (Array.isArray(tags)) {
      await tx.cardTag.deleteMany({ where: { cardId: id } });
      if (tags.length) {
        await tx.card.update({
          where: { id },
          data: {
            tags: {
              create: tags.map((t) => ({ tag: { connectOrCreate: { where: { ownerId_name: { ownerId: userId, name: t } }, create: { ownerId: userId, name: t } } } })),
            },
          },
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
