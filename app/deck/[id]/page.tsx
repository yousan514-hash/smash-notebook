import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { FilterUI } from '@/components/deck/filter-ui'
import { CardList } from '@/components/deck/card-list'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface DeckPageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function DeckContent({ deckId, searchParams }: { deckId: string, searchParams: DeckPageProps['searchParams'] }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: {
      owner: true,
      cards: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!deck) {
    notFound()
  }

  // アクセス権限チェック
  const profile = user ? await prisma.profile.findUnique({
    where: { userId: user.id }
  }) : null

  const isOwner = profile?.id === deck.ownerId
  if (!deck.isPublic && !isOwner) {
    return (
      <EmptyState
        title="アクセス権限がありません"
        description="このデッキは非公開です"
      />
    )
  }

  // フィルタ用のデータを収集
  const oppMoves = [...new Set(deck.cards.filter(c => c.oppMove).map(c => c.oppMove!))]
  const allTags = [...new Set(deck.cards.flatMap(c => c.tags))]

  // フィルタを適用
  let filteredCards = [...deck.cards]
  
  if (searchParams.percentBand) {
    filteredCards = filteredCards.filter(c => c.percentBand === searchParams.percentBand)
  }
  
  if (searchParams.situation) {
    filteredCards = filteredCards.filter(c => c.situation === searchParams.situation)
  }
  
  if (searchParams.oppMove) {
    filteredCards = filteredCards.filter(c => c.oppMove === searchParams.oppMove)
  }
  
  const tagParams = Array.isArray(searchParams.tag) ? searchParams.tag : searchParams.tag ? [searchParams.tag] : []
  if (tagParams.length > 0) {
    filteredCards = filteredCards.filter(c => 
      tagParams.every(tag => c.tags.includes(tag))
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{deck.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {deck.targetChar} • @{deck.owner.username}
            </p>
            {deck.description && (
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {deck.description}
              </p>
            )}
          </div>
          {isOwner && (
            <Link
              href={`/deck/${deck.id}/card/new`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>カード追加</span>
            </Link>
          )}
        </div>
      </div>

      <FilterUI
        deckId={deck.id}
        oppMoves={oppMoves}
        availableTags={allTags}
      />

      {filteredCards.length === 0 ? (
        <EmptyState
          title="カードが見つかりません"
          description={
            deck.cards.length === 0
              ? "このデッキにはまだカードがありません"
              : "フィルタ条件に一致するカードがありません"
          }
          action={
            isOwner && deck.cards.length === 0 ? (
              <Link
                href={`/deck/${deck.id}/card/new`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                最初のカードを作成
              </Link>
            ) : undefined
          }
        />
      ) : (
        <CardList cards={filteredCards} isOwner={isOwner} />
      )}
    </>
  )
}

function DeckSkeleton() {
  return (
    <>
      <div className="mb-8">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </>
  )
}

export default function DeckPage({ params, searchParams }: DeckPageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Suspense fallback={<DeckSkeleton />}>
        <DeckContent deckId={params.id} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}