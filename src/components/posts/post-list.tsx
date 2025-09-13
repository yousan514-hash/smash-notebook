'use client'

import { PostWithOwner } from '@/types'
import { PostSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { PostToCardButton } from './post-to-card-button'
import { MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

interface PostListProps {
  posts: PostWithOwner[]
  loading?: boolean
  showCardButton?: boolean
}

export function PostList({ posts, loading, showCardButton = true }: PostListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="投稿がありません"
        description="最初の投稿を作成してみましょう"
        action={{
          label: "投稿を作成",
          onClick: () => {
            // Handle post creation
          }
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div
          key={post.id}
          className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow"
        >
          {/* ユーザー情報 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {post.owner.username[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{post.owner.username}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* 投稿内容 */}
          <div className="space-y-3">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* アクション */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Heart className="h-4 w-4" />
                <span className="text-xs">いいね</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">コメント</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Share2 className="h-4 w-4" />
                <span className="text-xs">共有</span>
              </Button>
            </div>

            {showCardButton && (
              <PostToCardButton post={post} />
            )}
          </div>

          {/* 公開状態 */}
          {!post.isPublic && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="h-2 w-2 bg-yellow-500 rounded-full" />
              非公開投稿
            </div>
          )}
        </div>
      ))}
    </div>
  )
}