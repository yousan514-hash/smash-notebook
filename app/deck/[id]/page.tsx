import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { DeckFilter, PERCENT_BANDS, SITUATIONS, readDeckFilterFromSearchParams } from '@/lib/filters';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default async function DeckPage({ params, searchParams }: { params: { id: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, x));
    else if (v) sp.set(k, v);
  }
  const filter = readDeckFilterFromSearchParams(sp);

  const deck = await prisma.deck.findUnique({ where: { id: params.id } });
  if (!deck) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">デッキが見つかりません</h1>
      </main>
    );
  }

  return (
    <main className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{deck.title}</h1>
        <Link href={`/deck/new?clone=${deck.id}`} className="tap-target rounded bg-gray-900 px-3 py-2 text-white">＋カード</Link>
      </header>
      {/* Filters */}
      <DeckFilters deckId={deck.id} initialFilter={filter} />
      {/* Cards */}
      <Suspense fallback={<Skeleton className="h-24 w-full" />}>
        {/* Server component for listing */}
        {/* @ts-expect-error Async Server Component */}
        <CardList deckId={deck.id} filter={filter} />
      </Suspense>
    </main>
  );
}

function buildWhere(filter: DeckFilter) {
  const where: any = {};
  if (filter.percentBand !== undefined) where.percentBand = filter.percentBand;
  if (filter.situation) where.situation = filter.situation as any;
  if (filter.oppMove) where.oppMove = { contains: filter.oppMove };
  if (filter.tags && filter.tags.length) {
    where.tags = { some: { tag: { name: { in: filter.tags } } } };
  }
  return where;
}

async function CardList({ deckId, filter }: { deckId: string; filter: DeckFilter }) {
  const cards = await prisma.card.findMany({
    where: { deckId, ...buildWhere(filter) },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, percentBand: true, situation: true, oppMove: true },
  });
  if (cards.length === 0) {
    return <div className="text-sm text-gray-600">条件に一致するカードがありません</div>;
  }
  return (
    <ul className="divide-y divide-gray-200 rounded border">
      {cards.map((c) => (
        <li key={c.id} className="p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{c.title}</div>
            <div className="text-xs text-gray-500">{c.percentBand} / {c.situation}{c.oppMove ? ` / ${c.oppMove}` : ''}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function DeckFilters({ deckId, initialFilter }: { deckId: string; initialFilter: DeckFilter }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
      <PercentSelect initial={initialFilter.percentBand} />
      <SituationSelect initial={initialFilter.situation} />
      <OppMoveInput initial={initialFilter.oppMove} />
      <TagsInput initial={initialFilter.tags || []} />
    </div>
  );
}

function PercentSelect({ initial }: { initial?: number }) {
  return (
    <FilterClient name="percentBand" initialValue={initial ? String(initial) : ''}>
      <select className="w-full rounded border px-2 py-2" defaultValue={initial ? String(initial) : ''}>
        <option value="">%帯</option>
        {PERCENT_BANDS.map((b) => (
          <option key={b} value={b}>{b === 999 ? 'Kill%' : `${b}%`}</option>
        ))}
      </select>
    </FilterClient>
  );
}

function SituationSelect({ initial }: { initial?: string }) {
  return (
    <FilterClient name="situation" initialValue={initial ?? ''}>
      <select className="w-full rounded border px-2 py-2" defaultValue={initial ?? ''}>
        <option value="">状況</option>
        {SITUATIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </FilterClient>
  );
}

function OppMoveInput({ initial }: { initial?: string }) {
  return (
    <FilterClient name="oppMove" initialValue={initial ?? ''}>
      <input className="w-full rounded border px-2 py-2" placeholder="相手技名" defaultValue={initial ?? ''} />
    </FilterClient>
  );
}

function TagsInput({ initial }: { initial: string[] }) {
  return (
    <FilterClient name="tags" initialValue={initial} multiple>
      <input className="w-full rounded border px-2 py-2" placeholder="タグ（カンマ区切り）" defaultValue={initial.join(',')} />
    </FilterClient>
  );
}

// Client wrapper to sync value to query + recent filters
function FilterClient({ name, initialValue, multiple, children }: { name: string; initialValue: string | string[]; multiple?: boolean; children: React.ReactElement }) {
  return (
    // @ts-expect-error Client Component in Server File
    <FilterClientInner name={name} initialValue={initialValue} multiple={multiple}>
      {children}
    </FilterClientInner>
  );
}

