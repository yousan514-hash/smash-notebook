'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PostToCardDraft, DeckWithCards } from '@/types'
import { X, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

interface PostToCardModalProps {
  draft: PostToCardDraft
  onClose: () => void
}

export function PostToCardModal({ draft, onClose }: PostToCardModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<'deck-selection' | 'preview'>('deck-selection')
  const [selectedDeckId, setSelectedDeckId] = useState('')
  const [decks, setDecks] = useState<DeckWithCards[]>([])
  const [loading, setLoading] = useState(false)

  // ユーザーのデッキ一覧を取得
  useEffect(() => {
    async function fetchDecks() {
      try {
        // TODO: APIからデッキ一覧を取得
        // const response = await fetch('/api/decks')
        // const data = await response.json()
        // setDecks(data.decks)
        
        // 仮のデータ
        const mockDecks: DeckWithCards[] = [
          {
            id: 'deck-1',
            title: 'マリオ対策',
            description: 'マリオ戦での立ち回りと対策',
            isPublic: false,
            ownerId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [],
            owner: {
              id: 'user-1',
              userId: 'auth-user-1',
              username: 'player1',
              email: null,
              avatarUrl: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          },
          {
            id: 'deck-2',
            title: '基本立ち回り',
            description: '汎用的な立ち回り集',
            isPublic: true,
            ownerId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            cards: [],
            owner: {
              id: 'user-1',
              userId: 'auth-user-1',
              username: 'player1',
              email: null,
              avatarUrl: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          }
        ]
        setDecks(mockDecks)
      } catch (error) {
        console.error('Failed to fetch decks:', error)
      }
    }

    fetchDecks()
  }, [])

  const handleDeckSelect = (deckId: string) => {
    setSelectedDeckId(deckId)
    setStep('preview')
  }

  const handleCreateCard = async () => {
    if (!selectedDeckId) return

    setLoading(true)
    try {
      // TODO: API呼び出しでカード草稿を作成
      // const response = await fetch('/api/cards/draft', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     postId: draft.postId,
      //     deckId: selectedDeckId,
      //     extractedData: draft.extractedData
      //   })
      // })
      // const cardDraft = await response.json()
      
      // アナリティクス
      trackEvent.postToCardDraft(draft.postId, selectedDeckId)
      
      // カード編集画面に遷移
      router.push(`/deck/${selectedDeckId}/card/new?from-post=${draft.postId}`)
      onClose()
    } catch (error) {
      console.error('Failed to create card draft:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedDeck = decks.find(deck => deck.id === selectedDeckId)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">投稿からカードを作成</h2>
            <p className="text-sm text-muted-foreground">
              投稿内容をもとにカードの草稿を作成します
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {step === 'deck-selection' && (
            <>
              <div className="space-y-3">
                <h3 className="font-medium">デッキを選択</h3>
                <p className="text-sm text-muted-foreground">
                  カードを追加するデッキを選択してください
                </p>
              </div>

              <div className="space-y-3">
                {decks.map(deck => (
                  <button
                    key={deck.id}
                    onClick={() => handleDeckSelect(deck.id)}
                    className="w-full text-left p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{deck.title}</h4>
                        {deck.isPublic && (
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                            公開
                          </span>
                        )}
                      </div>
                      {deck.description && (
                        <p className="text-sm text-muted-foreground">
                          {deck.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {deck.cards.length} カード
                      </p>
                    </div>
                  </button>
                ))}

                {decks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>利用可能なデッキがありません</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => router.push('/deck/new')}
                    >
                      新しいデッキを作成
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 'preview' && selectedDeck && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep('deck-selection')}
                  >
                    ← 戻る
                  </Button>
                  <div>
                    <h3 className="font-medium">カード草稿プレビュー</h3>
                    <p className="text-sm text-muted-foreground">
                      「{selectedDeck.title}」に追加されます
                    </p>
                  </div>
                </div>
              </div>

              {/* 抽出された情報 */}
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-sm">投稿内容</h4>
                  <div className="text-sm whitespace-pre-wrap bg-background rounded p-3 border">
                    {draft.extractedData.content}
                  </div>
                </div>

                {/* 抽出されたデータ */}
                <div className="grid gap-4 md:grid-cols-2">
                  {draft.extractedData.percentBands.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        抽出された%帯
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {draft.extractedData.percentBands.map(percent => (
                          <span
                            key={percent}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                          >
                            {percent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {draft.extractedData.moveNames.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        抽出された技名
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {draft.extractedData.moveNames.map(move => (
                          <span
                            key={move}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                          >
                            {move}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">カード草稿について</p>
                      <p className="text-xs text-muted-foreground">
                        投稿内容と抽出されたデータをもとに、カードの草稿が作成されます。
                        詳細は編集画面で調整できます。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('deck-selection')}
                  disabled={loading}
                >
                  デッキを変更
                </Button>
                <Button onClick={handleCreateCard} disabled={loading}>
                  {loading ? '作成中...' : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      カード草稿を作成
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}