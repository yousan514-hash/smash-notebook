'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@prisma/client'
import { PercentBand, Situation } from '@/types'
import { TagInput } from '@/components/ui/tag-input'
import { MDXRenderer } from '@/components/mdx/mdx-renderer'
import { generateSectionTags, mergeTags } from '@/utils/tag-helpers'
import { usePostHog } from 'posthog-js/react'
import { cn } from '@/lib/utils'

const PERCENT_BANDS: PercentBand[] = ['00', '50', '80', 'Kill']
const SITUATIONS: Situation[] = ['立ち回り', '崖展開', '撃墜', '着地狩り', '復帰阻止']

interface CardFormProps {
  deckId: string
  card?: Card
  availableTags?: string[]
}

export function CardForm({ deckId, card, availableTags = [] }: CardFormProps) {
  const router = useRouter()
  const posthog = usePostHog()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    percentBand: card?.percentBand || '50' as PercentBand,
    situation: card?.situation || '立ち回り' as Situation,
    oppChar: card?.oppChar || '',
    oppMove: card?.oppMove || '',
    answerMD: card?.answerMD || '',
    tags: card?.tags || [],
  })

  // シチュエーション変更時に自動タグ付け
  useEffect(() => {
    if (!card && formData.situation) {
      const sectionTags = generateSectionTags(formData.situation)
      setFormData(prev => ({
        ...prev,
        tags: mergeTags(prev.tags, sectionTags)
      }))
    }
  }, [formData.situation, card])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const url = card
        ? `/api/cards/${card.id}`
        : '/api/cards'
      
      const response = await fetch(url, {
        method: card ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          deckId,
        }),
      })

      if (!response.ok) {
        throw new Error('カードの保存に失敗しました')
      }

      const savedCard = await response.json()
      
      posthog?.capture(card ? 'card_updated' : 'card_created', {
        cardId: savedCard.id,
        deckId: savedCard.deckId,
        percentBand: savedCard.percentBand,
        situation: savedCard.situation,
        tagCount: savedCard.tags.length,
      })

      router.push(`/deck/${deckId}`)
    } catch (error) {
      console.error('Error saving card:', error)
      alert('カードの保存に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            %帯 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PERCENT_BANDS.map(band => (
              <button
                key={band}
                type="button"
                onClick={() => setFormData({ ...formData, percentBand: band })}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  formData.percentBand === band
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {band}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            シチュエーション <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.situation}
            onChange={(e) => setFormData({ ...formData, situation: e.target.value as Situation })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            {SITUATIONS.map(situation => (
              <option key={situation} value={situation}>
                {situation}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="oppChar" className="block text-sm font-medium mb-2">
            相手キャラ
          </label>
          <input
            id="oppChar"
            type="text"
            value={formData.oppChar}
            onChange={(e) => setFormData({ ...formData, oppChar: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            placeholder="例: Mario, Sora"
          />
        </div>

        <div>
          <label htmlFor="oppMove" className="block text-sm font-medium mb-2">
            相手の技
          </label>
          <input
            id="oppMove"
            type="text"
            value={formData.oppMove}
            onChange={(e) => setFormData({ ...formData, oppMove: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            placeholder="例: 空N, 横B"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          タグ
        </label>
        <TagInput
          value={formData.tags}
          onChange={(tags) => setFormData({ ...formData, tags })}
          suggestions={availableTags}
          placeholder="タグを追加..."
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Enterキーでタグを追加できます
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="answerMD" className="block text-sm font-medium">
            回答 <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showPreview ? '編集' : 'プレビュー'}
          </button>
        </div>
        
        {showPreview ? (
          <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 min-h-[200px]">
            <MDXRenderer content={formData.answerMD} />
          </div>
        ) : (
          <textarea
            id="answerMD"
            value={formData.answerMD}
            onChange={(e) => setFormData({ ...formData, answerMD: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 font-mono text-sm"
            rows={10}
            required
            placeholder={`MDX形式で回答を記入できます。

例:
# 対策のポイント
1. 相手の空Nに対しては引きステップで間合いを取る
2. **ガード後**は即座に掴みで反撃

<Frame type="warning">
注意: 相手のダッシュ攻撃には気をつけること
</Frame>

通常のテキストも
改行して
記入できます`}
          />
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '保存中...' : card ? 'カードを更新' : 'カードを作成'}
        </button>
        
        <button
          type="button"
          onClick={() => router.push(`/deck/${deckId}`)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}