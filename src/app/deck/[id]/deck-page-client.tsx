'use client'

import { useState, useMemo } from 'react'
import { DeckWithCards, CardFilters, FilterOption } from '@/types'
import { CardFilters as CardFiltersComponent } from '@/components/cards/card-filters'
import { CardList } from '@/components/cards/card-list'
import { Button } from '@/components/ui/button'
import { Plus, Settings, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DeckPageClientProps {
  deck: DeckWithCards
  filterOptions: {
    percentBands: FilterOption[]
    situations: FilterOption[]
    oppMoves: FilterOption[]
    tags: FilterOption[]
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export function DeckPageClient({ deck, filterOptions, searchParams }: DeckPageClientProps) {
  const router = useRouter()
  
  // URL検索パラメータからフィルタを初期化
  const initialFilters: CardFilters = useMemo(() => ({
    percentBand: typeof searchParams.percentBand === 'string' ? searchParams.percentBand : undefined,
    situation: typeof searchParams.situation === 'string' ? searchParams.situation : undefined,
    oppMove: typeof searchParams.oppMove === 'string' ? searchParams.oppMove : undefined,
    tags: typeof searchParams.tags === 'string' ? searchParams.tags.split(',').filter(Boolean) : [],
  }), [searchParams])

  // フィルタされたカード
  const filteredCards = useMemo(() => {
    return deck.cards.filter(card => {
      // %帯フィルタ
      if (initialFilters.percentBand && card.percentBand !== initialFilters.percentBand) {
        return false
      }
      
      // シチュエーションフィルタ
      if (initialFilters.situation && card.situation !== initialFilters.situation) {
        return false
      }
      
      // 相手の技フィルタ
      if (initialFilters.oppMove && card.oppMove !== initialFilters.oppMove) {
        return false
      }
      
      // タグフィルタ
      if (initialFilters.tags && initialFilters.tags.length > 0) {
        const hasAllTags = initialFilters.tags.every(tag => card.tags.includes(tag))
        if (!hasAllTags) {
          return false
        }
      }
      
      return true
    })
  }, [deck.cards, initialFilters])

  const handleCardClick = (card: any) => {
    router.push(`/card/${card.id}`)
  }

  const handleNewCard = () => {
    router.push(`/deck/${deck.id}/card/new`)
  }

  const handleDeckSettings = () => {
    router.push(`/deck/${deck.id}/settings`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: deck.title,
          text: deck.description || `${deck.title}のカード集`,
          url: window.location.href,
        })
      } catch (error) {
        // ユーザーがキャンセルした場合など
      }
    } else {
      // フォールバック: クリップボードにコピー
      try {
        await navigator.clipboard.writeText(window.location.href)
        // TODO: トーストメッセージを表示
      } catch (error) {
        console.error('Failed to copy URL:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{deck.title}</h1>
            {deck.description && (
              <p className="text-muted-foreground mt-2">{deck.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span>{deck.cards.length} カード</span>
              <span>作成者: {deck.owner.username}</span>
              {deck.isPublic && <span>公開</span>}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              共有
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeckSettings}>
              <Settings className="h-4 w-4 mr-2" />
              設定
            </Button>
            <Button size="sm" onClick={handleNewCard}>
              <Plus className="h-4 w-4 mr-2" />
              カード追加
            </Button>
          </div>
        </div>
      </div>

      {/* フィルタ */}
      <CardFiltersComponent availableFilters={filterOptions} />

      {/* カード一覧 */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            カード一覧 ({filteredCards.length})
          </h2>
        </div>
        
        <CardList
          cards={filteredCards}
          filters={initialFilters}
          onCardClick={handleCardClick}
        />
      </div>
    </div>
  )
}