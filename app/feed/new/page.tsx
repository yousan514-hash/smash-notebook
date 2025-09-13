'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TagInput } from '@/components/ui/tag-input'
import { extractCardInfo } from '@/utils/post-parser'
import { usePostHog } from 'posthog-js/react'

export default function NewPostPage() {
  const router = useRouter()
  const posthog = usePostHog()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    tags: [] as string[],
    isPublic: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('ログインが必要です')
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('投稿の作成に失敗しました')
      }

      const post = await response.json()
      
      // 投稿内容から情報を抽出して計測
      const cardInfo = extractCardInfo(formData.content)
      posthog?.capture('post_created', {
        postId: post.id,
        isPublic: post.isPublic,
        tagCount: post.tags.length,
        hasPercentBand: !!cardInfo.percentBand,
        hasMoves: cardInfo.moves.length > 0,
      })

      router.push('/feed')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('投稿の作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  // リアルタイムで情報を抽出
  const extractedInfo = extractCardInfo(formData.content)

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">新規投稿</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            rows={8}
            required
            placeholder="スマブラの戦術や気づきを共有しましょう...

例: 50%のマリオに対して、空前からのコンボが確定することを発見！"
          />
          
          {(extractedInfo.percentBand || extractedInfo.moves.length > 0) && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
              <p className="text-blue-700 dark:text-blue-300 font-medium mb-1">
                検出された情報:
              </p>
              <ul className="text-blue-600 dark:text-blue-400">
                {extractedInfo.percentBand && (
                  <li>• %帯: {extractedInfo.percentBand}%</li>
                )}
                {extractedInfo.moves.length > 0 && (
                  <li>• 技: {extractedInfo.moves.join(', ')}</li>
                )}
              </ul>
              <p className="text-blue-600 dark:text-blue-400 mt-2">
                投稿後、この情報を使ってカードを作成できます
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            タグ
          </label>
          <TagInput
            value={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            placeholder="タグを追加..."
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium">公開投稿にする</span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            公開投稿は他のユーザーも閲覧できます
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/feed')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}