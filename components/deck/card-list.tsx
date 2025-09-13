'use client'

import { Card } from '@prisma/client'
import { MDXRenderer } from '@/components/mdx/mdx-renderer'
import { cn } from '@/lib/utils'
import { Edit, Trash } from 'lucide-react'
import Link from 'next/link'

interface CardListProps {
  cards: Card[]
  isOwner: boolean
}

export function CardList({ cards, isOwner }: CardListProps) {
  return (
    <div className="grid gap-4">
      {cards.map(card => (
        <div
          key={card.id}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={cn(
                  "px-2 py-1 text-sm font-medium rounded",
                  card.percentBand === '00' && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
                  card.percentBand === '50' && "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
                  card.percentBand === '80' && "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
                  card.percentBand === 'Kill' && "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                )}>
                  {card.percentBand}%
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {card.situation}
                </span>
              </div>
              {(card.oppChar || card.oppMove) && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {card.oppChar && <span>vs {card.oppChar}</span>}
                  {card.oppChar && card.oppMove && <span> • </span>}
                  {card.oppMove && <span>{card.oppMove}</span>}
                </div>
              )}
              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {card.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {isOwner && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/deck/${card.deckId}/card/${card.id}/edit`}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    // TODO: 削除機能を実装
                    console.log('Delete card:', card.id)
                  }}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <MDXRenderer content={card.answerMD} />
          </div>
        </div>
      ))}
    </div>
  )
}