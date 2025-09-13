import { prisma } from '@/lib/prisma';
import { getUserIdOrThrow } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const userId = getUserIdOrThrow();
  const tags = await prisma.tag.findMany({ where: { ownerId: userId }, select: { name: true }, orderBy: { name: 'asc' } });
  return NextResponse.json({ names: tags.map((t) => t.name) });
}
