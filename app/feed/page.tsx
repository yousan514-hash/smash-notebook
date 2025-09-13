import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { PostList } from '@/components/feed/post-list'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Suspense } from 'react'

async function FeedContent() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const profile = user ? await prisma.profile.findUnique({
    where: { userId: user.id }
  }) : null

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { isPublic: true },
        ...(profile ? [{ ownerId: profile.id }] : [])
      ]
    },
    include: {
      owner: true
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  if (posts.length === 0) {
    return (
      <EmptyState
        title="投稿がありません"
        description="最初の投稿を作成してみましょう"
        action={
          user ? (
            <Link
              href="/feed/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              投稿を作成
            </Link>
          ) : undefined
        }
      />
    )
  }

  return <PostList posts={posts} currentUserId={profile?.id} />
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FeedPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">フィード</h1>
        <Link
          href="/feed/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">新規投稿</span>
        </Link>
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <FeedContent />
      </Suspense>
    </div>
  )
}