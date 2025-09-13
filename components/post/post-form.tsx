'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostToCardExtractor, ExtractedData } from './post-to-card-extractor'
import { trackPostCreated } from '../../lib/analytics'

interface PostFormProps {
  onSubmit: (data: PostData) => Promise<void>
  initialData?: Partial<PostData>
}

interface PostData {
  title: string
  content: string
  isPublic: boolean
}

export function PostForm({ onSubmit, initialData }: PostFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<PostData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    isPublic: initialData?.isPublic || false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [showCardCreator, setShowCardCreator] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      trackPostCreated('new-post') // Track with a placeholder ID
      router.push('/')
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateCard = () => {
    if (extractedData) {
      // Navigate to card creation with extracted data
      const params = new URLSearchParams()
      if (extractedData.percentBands.length > 0) {
        params.set('percentBand', extractedData.percentBands[0])
      }
      if (extractedData.situations.length > 0) {
        params.set('situation', extractedData.situations[0])
      }
      if (extractedData.moves.length > 0) {
        params.set('oppMove', extractedData.moves[0])
      }
      if (extractedData.characters.length > 0) {
        params.set('oppChar', extractedData.characters[0])
      }
      
      // Store the post content for card creation
      localStorage.setItem('post-to-card-content', formData.content)
      
      router.push(`/deck/new?${params.toString()}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
            placeholder="投稿のタイトルを入力..."
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            内容
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="戦術や気づきを書いてください..."
            required
          />
        </div>

        {/* Post to Card Extractor */}
        {formData.content && (
          <PostToCardExtractor
            content={formData.content}
            onExtract={setExtractedData}
          />
        )}

        {/* Card Creation Button */}
        {extractedData && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-900">この投稿からカードを作成</h4>
                <p className="text-sm text-green-700">
                  抽出された情報を使ってカードの下書きを作成できます
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateCard}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors min-h-[44px]"
              >
                カード作成
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            公開する
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px]"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}