import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdOrThrow } from '@/lib/auth';

const SECTION_KEYWORDS: Record<string, string[]> = {
  '立ち回り': ['ニュートラル', '差し合い'],
  '崖展開': ['崖', '崖上がり', '崖捕まり'],
  '復帰阻止': ['復帰阻止', 'エッジガード'],
};

function autoSectionTags(text: string): string[] {
  const out: string[] = [];
  for (const [section, keys] of Object.entries(SECTION_KEYWORDS)) {
    if (keys.some((k) => text.includes(k))) out.push(section);
  }
  return out;
}

export async function POST(req: NextRequest) {
  const userId = getUserIdOrThrow();
  const { deckId, body, title } = await req.json();
  if (!deckId || !body) return NextResponse.json({ error: 'deckId and body required' }, { status: 400 });

  // lightweight extraction
  const percentMatch = String(body).match(/\b(0{2}|50|80|Kill)\s*%?/i);
  const percentMap: any = { '00': 0, '50': 50, '80': 80, Kill: 999 };
  const percentBand: number | undefined = percentMatch ? percentMap[percentMatch[1]] : undefined;
  const moveMatch = String(body).match(/[ァ-ヴー]{2,}/);
  const oppMove = moveMatch?.[0];

  const sectionTags = autoSectionTags(String(body));

  const created = await prisma.card.create({
    data: {
      deckId,
      ownerId: userId,
      title: title || '投稿からの下書き',
      percentBand: percentBand ?? 0,
      situation: 'NEUTRAL',
      oppMove: oppMove || undefined,
      answerMD: String(body),
      tags: sectionTags.length
        ? {
            create: sectionTags.map((t) => ({ tag: { connectOrCreate: { where: { ownerId_name: { ownerId: userId, name: t } }, create: { ownerId: userId, name: t } } } }))
          }
        : undefined,
    },
    select: { id: true },
  });
  return NextResponse.json({ ok: true, id: created.id });
}
