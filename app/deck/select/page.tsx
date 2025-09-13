'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Deck } from '@prisma/client'
import { createClient } from '@/lib/supabase/client'
import { generateCardDraft } from '@/utils/post-parser'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export default function DeckSelectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [decks, setDecks] = useState<Deck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const postId = searchParams.get('postId')
  const content = searchParams.get('content') || ''
  const percentBand = searchParams.get('percentBand')
  const moves = searchParams.get('moves')?.split(',') || []

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        const response = await fetch('/api/decks/my')
        if (!response.ok) throw new Error('Failed to fetch decks')
        
        const data = await response.json()
        setDecks(data)
      } catch (error) {
        console.error('Error fetching decks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDecks()
  }, [router])

  const handleCreateCard = async () => {
    if (!selectedDeckId || isCreating) return

    setIsCreating(true)
    try {
      const draft = generateCardDraft(content, { percentBand: percentBand as any, moves })
      
      // カード作成画面に遷移（下書きデータをクエリパラメータで渡す）
      const params = new URLSearchParams({
        draft: draft,
        ...(percentBand && { percentBand }),
        ...(postId && { postId }),
      })
      
      router.push(`/deck/${selectedDeckId}/card/new?${params}`)
    } catch (error) {
      console.error('Error creating card draft:', error)
      alert('カード草稿の作成に失敗しました')
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">デッキを選択</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (decks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">デッキを選択</h1>
        <EmptyState
          title="デッキがありません"
          description="カードを作成するにはまずデッキが必要です"
          action={
            <Link
              href="/deck/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              デッキを作成
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">デッキを選択</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        カードを作成するデッキを選択してください
      </p>

      <div className="space-y-4 mb-8">
        {decks.map(deck => (
          <div
            key={deck.id}
            onClick={() => setSelectedDeckId(deck.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedDeckId === deck.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{deck.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deck.targetChar}
                </p>
              </div>
              <input
                type="radio"
                checked={selectedDeckId === deck.id}
                onChange={() => {}}
                className="text-blue-600"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleCreateCard}
          disabled={!selectedDeckId || isCreating}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? '作成中...' : 'カード草稿を作成'}
        </button>
        
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}