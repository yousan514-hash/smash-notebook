'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterState {
  percentBand: string[]
  situation: string[]
  oppMove: string[]
  tags: string[]
}

interface DeckFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

const PERCENT_BANDS = ['00', '50', '80', 'Kill']
const SITUATIONS = ['立ち回り', '崖展開', '回復', 'コンボ', 'ガード', 'その他']
const COMMON_MOVES = ['スマッシュ', 'ジャンプ', 'ダッシュ', 'ガード', '投げ', '必殺技']

export function DeckFilters({ onFiltersChange, initialFilters }: DeckFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>({
    percentBand: [],
    situation: [],
    oppMove: [],
    tags: []
  })
  const [recentFilters, setRecentFilters] = useState<FilterState[]>([])

  // Load filters from URL and localStorage on mount
  useEffect(() => {
    const urlFilters: FilterState = {
      percentBand: searchParams.get('percentBand')?.split(',') || [],
      situation: searchParams.get('situation')?.split(',') || [],
      oppMove: searchParams.get('oppMove')?.split(',') || [],
      tags: searchParams.get('tags')?.split(',') || []
    }

    // Load recent filters from localStorage
    const stored = localStorage.getItem('deck-filters-recent')
    if (stored) {
      try {
        setRecentFilters(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse recent filters:', e)
      }
    }

    const finalFilters = initialFilters || urlFilters
    setFilters(finalFilters)
    onFiltersChange(finalFilters)
  }, [searchParams, initialFilters, onFiltersChange])

  // Save filters to URL and localStorage
  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters)
    onFiltersChange(newFilters)

    // Update URL
    const params = new URLSearchParams()
    if (newFilters.percentBand.length > 0) params.set('percentBand', newFilters.percentBand.join(','))
    if (newFilters.situation.length > 0) params.set('situation', newFilters.situation.join(','))
    if (newFilters.oppMove.length > 0) params.set('oppMove', newFilters.oppMove.join(','))
    if (newFilters.tags.length > 0) params.set('tags', newFilters.tags.join(','))

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.replace(newUrl, { scroll: false })

    // Save to recent filters
    const updatedRecent = [newFilters, ...recentFilters.filter(f => 
      JSON.stringify(f) !== JSON.stringify(newFilters)
    )].slice(0, 5)
    setRecentFilters(updatedRecent)
    localStorage.setItem('deck-filters-recent', JSON.stringify(updatedRecent))
  }

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    
    updateFilters({ ...filters, [category]: newValues })
  }

  const clearFilters = () => {
    updateFilters({ percentBand: [], situation: [], oppMove: [], tags: [] })
  }

  const applyRecentFilter = (recentFilter: FilterState) => {
    updateFilters(recentFilter)
  }

  const FilterChip = ({ 
    label, 
    isActive, 
    onClick 
  }: { 
    label: string
    isActive: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm transition-colors min-h-[44px] ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">フィルタ</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          クリア
        </button>
      </div>

      {/* Recent Filters */}
      {recentFilters.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">最近のフィルタ</h4>
          <div className="flex flex-wrap gap-2">
            {recentFilters.map((recentFilter, index) => (
              <button
                key={index}
                onClick={() => applyRecentFilter(recentFilter)}
                className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                最近の設定 {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Percent Band Filter */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">%帯</h4>
        <div className="flex flex-wrap gap-2">
          {PERCENT_BANDS.map(band => (
            <FilterChip
              key={band}
              label={band}
              isActive={filters.percentBand.includes(band)}
              onClick={() => toggleFilter('percentBand', band)}
            />
          ))}
        </div>
      </div>

      {/* Situation Filter */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">状況</h4>
        <div className="flex flex-wrap gap-2">
          {SITUATIONS.map(situation => (
            <FilterChip
              key={situation}
              label={situation}
              isActive={filters.situation.includes(situation)}
              onClick={() => toggleFilter('situation', situation)}
            />
          ))}
        </div>
      </div>

      {/* Opponent Move Filter */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">相手の技</h4>
        <div className="flex flex-wrap gap-2">
          {COMMON_MOVES.map(move => (
            <FilterChip
              key={move}
              label={move}
              isActive={filters.oppMove.includes(move)}
              onClick={() => toggleFilter('oppMove', move)}
            />
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">タグ</h4>
        <div className="flex flex-wrap gap-2">
          {filters.tags.map(tag => (
            <FilterChip
              key={tag}
              label={tag}
              isActive={true}
              onClick={() => toggleFilter('tags', tag)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}