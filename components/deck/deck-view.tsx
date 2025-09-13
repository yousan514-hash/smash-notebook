'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DeckFilters } from './deck-filters'
import { SkeletonCard, EmptyState } from '../ui/skeleton'
import { CardAnswer } from '../../lib/mdx'

interface Card {
  id: string
  title: string
  question: string
  answerMD: string
  percentBand: string | null
  situation: string | null
  oppChar: string | null
  oppMove: string | null
  tags: string[]
  createdAt: string
}

interface Deck {
  id: string
  title: string
  description: string | null
  character: string
  isPublic: boolean
  cards: Card[]
}

interface DeckViewProps {
  deck: Deck
}

export function DeckView({ deck }: DeckViewProps) {
  const router = useRouter()
  const [filteredCards, setFilteredCards] = useState<Card[]>(deck.cards)
  const [isLoading, setIsLoading] = useState(false)

  const applyFilters = (filters: {
    percentBand: string[]
    situation: string[]
    oppMove: string[]
    tags: string[]
  }) => {
    setIsLoading(true)
    
    let filtered = deck.cards

    if (filters.percentBand.length > 0) {
      filtered = filtered.filter(card => 
        card.percentBand && filters.percentBand.includes(card.percentBand)
      )
    }

    if (filters.situation.length > 0) {
      filtered = filtered.filter(card => 
        card.situation && filters.situation.includes(card.situation)
      )
    }

    if (filters.oppMove.length > 0) {
      filtered = filtered.filter(card => 
        card.oppMove && filters.oppMove.includes(card.oppMove)
      )
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(card => 
        filters.tags.some(tag => card.tags.includes(tag))
      )
    }

    setFilteredCards(filtered)
    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Deck Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{deck.title}</h1>
            <p className="text-gray-600 mt-1">{deck.character}</p>
          </div>
          <button
            onClick={() => router.push(`/deck/${deck.id}/edit`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
          >
            編集
          </button>
        </div>
        {deck.description && (
          <p className="text-gray-700">{deck.description}</p>
        )}
      </div>

      {/* Filters */}
      <DeckFilters onFiltersChange={applyFilters} />

      {/* Cards List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredCards.length === 0 ? (
          <EmptyState
            title="カードが見つかりません"
            description="フィルタ条件を変更して再度お試しください"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        ) : (
          filteredCards.map(card => (
            <CardItem key={card.id} card={card} />
          ))
        )}
      </div>
    </div>
  )
}

function CardItem({ card }: { card: Card }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
        <div className="flex gap-2">
          {card.percentBand && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {card.percentBand}%
            </span>
          )}
          {card.situation && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {card.situation}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">質問</h4>
        <p className="text-gray-900">{card.question}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">回答</h4>
        <CardAnswer answerMD={card.answerMD} className="text-gray-900" />
      </div>

      {(card.oppChar || card.oppMove) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">相手情報</h4>
          <div className="flex gap-2">
            {card.oppChar && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                キャラ: {card.oppChar}
              </span>
            )}
            {card.oppMove && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                技: {card.oppMove}
              </span>
            )}
          </div>
        </div>
      )}

      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {card.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}