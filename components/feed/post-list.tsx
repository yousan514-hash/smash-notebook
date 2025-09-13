'use client'

import { Post, Profile } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { extractCardInfo } from '@/utils/post-parser'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'

interface PostWithOwner extends Post {
  owner: Profile
}

interface PostListProps {
  posts: PostWithOwner[]
  currentUserId?: string
}

export function PostList({ posts, currentUserId }: PostListProps) {
  const router = useRouter()
  const posthog = usePostHog()
  const [convertingPostId, setConvertingPostId] = useState<string | null>(null)

  const handleConvertToCard = async (post: PostWithOwner) => {
    if (!currentUserId) {
      alert('ログインが必要です')
      return
    }

    setConvertingPostId(post.id)
    
    try {
      // 投稿内容から情報を抽出
      const cardInfo = extractCardInfo(post.content)
      
      // デッキ選択画面に遷移（抽出した情報をクエリパラメータで渡す）
      const params = new URLSearchParams({
        postId: post.id,
        content: post.content,
        ...(cardInfo.percentBand && { percentBand: cardInfo.percentBand }),
        ...(cardInfo.moves.length > 0 && { moves: cardInfo.moves.join(',') }),
      })
      
      posthog?.capture('post_to_card_initiated', {
        postId: post.id,
        extractedPercentBand: cardInfo.percentBand,
        extractedMovesCount: cardInfo.moves.length,
      })
      
      router.push(`/deck/select?${params}`)
    } catch (error) {
      console.error('Error converting post to card:', error)
      alert('カード変換に失敗しました')
    } finally {
      setConvertingPostId(null)
    }
  }

  return (
    <div className="space-y-4">
      {posts.map(post => {
        const cardInfo = extractCardInfo(post.content)
        const hasCardInfo = cardInfo.percentBand || cardInfo.moves.length > 0
        
        return (
          <div
            key={post.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium">
                  {post.owner.username[0].toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">@{post.owner.username}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </span>
                  {!post.isPublic && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                      非公開
                    </span>
                  )}
                </div>
                
                <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap mb-3">
                  {post.content}
                </div>
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {hasCardInfo && currentUserId && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        検出された情報:
                        {cardInfo.percentBand && (
                          <span className="ml-2 font-medium">{cardInfo.percentBand}%</span>
                        )}
                        {cardInfo.moves.length > 0 && (
                          <span className="ml-2">
                            技: {cardInfo.moves.join(', ')}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleConvertToCard(post)}
                        disabled={convertingPostId === post.id}
                        className={cn(
                          "px-3 py-1 text-sm rounded-md transition-colors",
                          "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
                          "hover:bg-blue-200 dark:hover:bg-blue-800",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {convertingPostId === post.id ? '処理中...' : 'カードに変換'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}