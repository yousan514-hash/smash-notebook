'use client'

import { CardWithDeck, CardFilters } from '@/types'
import { CardSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, Search } from 'lucide-react'
import { SafeMDX } from '@/components/mdx/safe-mdx'
import { formatDate } from '@/lib/utils'

interface CardListProps {
  cards: CardWithDeck[]
  loading?: boolean
  filters?: CardFilters
  onCardClick?: (card: CardWithDeck) => void
}

export function CardList({ cards, loading, filters, onCardClick }: CardListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (cards.length === 0) {
    const hasFilters = filters && Object.keys(filters).length > 0
    
    return (
      <EmptyState
        icon={hasFilters ? Search : FileText}
        title={hasFilters ? "該当するカードが見つかりません" : "カードがありません"}
        description={
          hasFilters 
            ? "フィルタ条件を変更して再度お試しください"
            : "最初のカードを作成してみましょう"
        }
        action={
          hasFilters 
            ? undefined 
            : {
                label: "カードを作成",
                onClick: () => {
                  // Handle card creation
                }
              }
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {cards.map(card => (
        <div
          key={card.id}
          className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCardClick?.(card)}
        >
          {/* カードヘッダー */}
          <div className="flex justify-between items-start">
            <div className="flex gap-2 text-sm">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                {card.percentBand}
              </span>
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                {card.situation}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(card.createdAt)}
            </span>
          </div>

          {/* 相手情報 */}
          {(card.oppChar || card.oppMove) && (
            <div className="flex gap-2 text-sm">
              {card.oppChar && (
                <span className="text-muted-foreground">
                  vs {card.oppChar}
                </span>
              )}
              {card.oppMove && (
                <span className="text-muted-foreground">
                  {card.oppMove}
                </span>
              )}
            </div>
          )}

          {/* 質問 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">シチュエーション</h3>
            <div className="text-sm">
              <SafeMDX content={card.questionMD} />
            </div>
          </div>

          {/* 回答（プレビュー） */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">対策</h3>
            <div className="text-sm line-clamp-3">
              <SafeMDX content={card.answerMD} />
            </div>
          </div>

          {/* タグ */}
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}