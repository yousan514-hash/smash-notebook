import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import { Suspense } from 'react'

async function DeckList() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <EmptyState
        title="ログインが必要です"
        description="デッキを表示するにはログインしてください"
        action={
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ログイン
          </Link>
        }
      />
    )
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) {
    return (
      <EmptyState
        title="プロフィールが見つかりません"
        description="プロフィールを作成してください"
      />
    )
  }

  const decks = await prisma.deck.findMany({
    where: {
      OR: [
        { ownerId: profile.id },
        { isPublic: true }
      ]
    },
    include: {
      owner: true,
      _count: {
        select: { cards: true }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })

  if (decks.length === 0) {
    return (
      <EmptyState
        title="デッキがありません"
        description="最初のデッキを作成してみましょう"
        action={
          <Link
            href="/deck/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            デッキを作成
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {decks.map(deck => (
        <Link
          key={deck.id}
          href={`/deck/${deck.id}`}
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold">{deck.title}</h3>
            {deck.isPublic && (
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                公開
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {deck.targetChar}
          </p>
          {deck.description && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 line-clamp-2">
              {deck.description}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
            <span>{deck._count.cards} カード</span>
            <span>@{deck.owner.username}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function DeckListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-12 w-full mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DecksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">デッキ一覧</h1>
        <Link
          href="/deck/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新規デッキ</span>
        </Link>
      </div>

      <Suspense fallback={<DeckListSkeleton />}>
        <DeckList />
      </Suspense>
    </div>
  )
}