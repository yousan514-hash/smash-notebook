'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { usePostHog } from 'posthog-js/react'
import { TemplateExpander } from '@/components/deck/template-expander'

export default function NewDeckPage() {
  const router = useRouter()
  const posthog = usePostHog()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetChar: '',
    isPublic: false,
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

      const response = await fetch('/api/deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('デッキの作成に失敗しました')
      }

      const deck = await response.json()
      
      posthog?.capture('deck_created', {
        deckId: deck.id,
        targetChar: deck.targetChar,
        isPublic: deck.isPublic,
      })

      router.push(`/deck/${deck.id}`)
    } catch (error) {
      console.error('Error creating deck:', error)
      alert('デッキの作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">新規デッキ作成</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            デッキ名 <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            placeholder="例: ソラ対策デッキ"
          />
        </div>

        <div>
          <label htmlFor="targetChar" className="block text-sm font-medium mb-2">
            自キャラ <span className="text-red-500">*</span>
          </label>
          <input
            id="targetChar"
            type="text"
            required
            value={formData.targetChar}
            onChange={(e) => setFormData({ ...formData, targetChar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            placeholder="例: Mario, Sora, Link"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            説明
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            rows={3}
            placeholder="デッキの説明を入力..."
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
            <span className="text-sm font-medium">公開デッキにする</span>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            公開デッキは他のユーザーも閲覧できます
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '作成中...' : 'デッキを作成'}
          </button>

          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            00テンプレを展開
          </button>
        </div>
      </form>

      {showTemplates && (
        <div className="mt-8">
          <TemplateExpander targetChar={formData.targetChar} />
        </div>
      )}
    </div>
  )
}