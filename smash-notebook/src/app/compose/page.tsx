'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'

// Sample decks for linking
const sampleDecks = [
  { id: '1', title: 'マリオ vs フォックス対策' },
  { id: '2', title: 'ピカチュウ基本セットアップ' },
  { id: '3', title: 'クラウド崖狩り特化' },
]

export default function ComposePage() {
  const [formData, setFormData] = useState({
    content: '',
    deckId: '',
    tags: [] as string[],
    imageUrl: '',
    videoUrl: '',
  })
  
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement post creation
    console.log('Creating post:', formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">新しい投稿</h1>
          <p className="text-gray-600 mt-2">コミュニティと知識を共有しましょう</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  投稿内容 *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="今日の対戦で学んだこと、質問、デッキの紹介など何でもシェアしてください..."
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.content.length}/500
                </div>
              </div>

              {/* Deck Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  関連デッキ（オプション）
                </label>
                <select
                  value={formData.deckId}
                  onChange={(e) => setFormData(prev => ({ ...prev, deckId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">関連するデッキを選択（任意）</option>
                  {sampleDecks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                      {deck.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Media Upload */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    画像URL（オプション）
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    動画URL（オプション）
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  タグ
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="タグを入力してEnterキーを押す"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    追加
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  推奨タグ: キャラクター名、戦術、質問、VIP、大会など
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.content && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">プレビュー</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="font-semibold">あなた</div>
                    <div className="text-sm text-gray-500">今</div>
                  </div>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap mb-3">{formData.content}</p>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              下書き保存
            </Button>
            <Button type="submit">
              投稿する
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}