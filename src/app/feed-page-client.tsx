'use client'

import { useState } from 'react'
import { PostWithOwner } from '@/types'
import { PostList } from '@/components/posts/post-list'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FeedPageClientProps {
  posts: PostWithOwner[]
}

export function FeedPageClient({ posts: initialPosts }: FeedPageClientProps) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'recent' | 'trending'>('recent')

  const handleNewPost = () => {
    router.push('/post/new')
  }

  const handleFilterChange = async (newFilter: 'recent' | 'trending') => {
    if (newFilter === filter) return

    setFilter(newFilter)
    setLoading(true)

    try {
      // TODO: APIから投稿を取得
      // const response = await fetch(`/api/posts?filter=${newFilter}`)
      // const data = await response.json()
      // setPosts(data.posts)
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    setLoading(true)
    try {
      // TODO: 追加の投稿を取得
      // const lastPost = posts[posts.length - 1]
      // const response = await fetch(`/api/posts?cursor=${lastPost.id}&filter=${filter}`)
      // const data = await response.json()
      // setPosts(prev => [...prev, ...data.posts])
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">フィード</h1>
          <p className="text-muted-foreground">
            スマブラプレイヤーの戦術投稿をチェック
          </p>
        </div>
        
        <Button onClick={handleNewPost}>
          <Plus className="h-4 w-4 mr-2" />
          投稿する
        </Button>
      </div>

      {/* フィルタ */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'recent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('recent')}
          disabled={loading}
        >
          <Clock className="h-4 w-4 mr-2" />
          最新
        </Button>
        <Button
          variant={filter === 'trending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('trending')}
          disabled={loading}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          トレンド
        </Button>
      </div>

      {/* 投稿一覧 */}
      <PostList posts={posts} loading={loading} />

      {/* もっと読む */}
      {!loading && posts.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={loadMore}>
            もっと読む
          </Button>
        </div>
      )}

      {/* 投稿作成のCTA */}
      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">まだ投稿がありません</h3>
            <p className="text-muted-foreground">
              最初の投稿を作成して、コミュニティを盛り上げましょう！
            </p>
            <Button onClick={handleNewPost}>
              <Plus className="h-4 w-4 mr-2" />
              投稿を作成
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}