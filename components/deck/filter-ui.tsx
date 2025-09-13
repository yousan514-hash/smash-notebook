'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FilterState, PercentBand, Situation, RecentFilter } from '@/types'
import { cn } from '@/lib/utils'
import { X, Filter } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'

const PERCENT_BANDS: PercentBand[] = ['00', '50', '80', 'Kill']
const SITUATIONS: Situation[] = ['立ち回り', '崖展開', '撃墜', '着地狩り', '復帰阻止']
const RECENT_FILTERS_KEY = 'smash-notebook-recent-filters'
const MAX_RECENT_FILTERS = 5

interface FilterUIProps {
  deckId: string
  oppMoves?: string[]
  availableTags?: string[]
}

export function FilterUI({ deckId, oppMoves = [], availableTags = [] }: FilterUIProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  const [filters, setFilters] = useState<FilterState>({})
  const [recentFilters, setRecentFilters] = useState<RecentFilter[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // URLクエリからフィルタを読み込み
  useEffect(() => {
    const newFilters: FilterState = {}
    
    const percentBand = searchParams.get('percentBand')
    if (percentBand && PERCENT_BANDS.includes(percentBand as PercentBand)) {
      newFilters.percentBand = percentBand as PercentBand
    }
    
    const situation = searchParams.get('situation')
    if (situation && SITUATIONS.includes(situation as Situation)) {
      newFilters.situation = situation as Situation
    }
    
    const oppMove = searchParams.get('oppMove')
    if (oppMove) {
      newFilters.oppMove = oppMove
    }
    
    const tags = searchParams.getAll('tag')
    if (tags.length > 0) {
      newFilters.tags = tags
    }
    
    setFilters(newFilters)
  }, [searchParams])

  // localStorageから最近のフィルタを読み込み
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_FILTERS_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as RecentFilter[]
        setRecentFilters(parsed.filter(f => Date.now() - f.timestamp < 7 * 24 * 60 * 60 * 1000)) // 7日以内
      } catch (e) {
        console.error('Failed to parse recent filters:', e)
      }
    }
  }, [])

  const updateFilters = (newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.percentBand) {
      params.set('percentBand', newFilters.percentBand)
    }
    if (newFilters.situation) {
      params.set('situation', newFilters.situation)
    }
    if (newFilters.oppMove) {
      params.set('oppMove', newFilters.oppMove)
    }
    if (newFilters.tags && newFilters.tags.length > 0) {
      newFilters.tags.forEach(tag => params.append('tag', tag))
    }
    
    router.push(`/deck/${deckId}?${params.toString()}`)
    
    // PostHogイベント送信
    posthog?.capture('filter_changed', {
      deckId,
      filters: newFilters,
    })
    
    // 最近のフィルタに保存
    if (Object.keys(newFilters).length > 0) {
      const newRecent: RecentFilter = {
        id: crypto.randomUUID(),
        filter: newFilters,
        timestamp: Date.now(),
      }
      const updated = [newRecent, ...recentFilters.filter(f => 
        JSON.stringify(f.filter) !== JSON.stringify(newFilters)
      )].slice(0, MAX_RECENT_FILTERS)
      setRecentFilters(updated)
      localStorage.setItem(RECENT_FILTERS_KEY, JSON.stringify(updated))
    }
  }

  const clearFilters = () => {
    router.push(`/deck/${deckId}`)
    setFilters({})
  }

  const applyRecentFilter = (filter: FilterState) => {
    updateFilters(filter)
    setIsOpen(false)
  }

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof FilterState]
    return value && (Array.isArray(value) ? value.length > 0 : true)
  }).length

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors tap-target",
            activeFilterCount > 0
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          )}
        >
          <Filter className="w-4 h-4" />
          <span>フィルタ</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
        
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            クリア
          </button>
        )}
      </div>

      {isOpen && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {/* %帯フィルタ */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              %帯
            </label>
            <div className="flex flex-wrap gap-2">
              {PERCENT_BANDS.map(band => (
                <button
                  key={band}
                  onClick={() => updateFilters({
                    ...filters,
                    percentBand: filters.percentBand === band ? undefined : band
                  })}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm transition-colors",
                    filters.percentBand === band
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                  )}
                >
                  {band}%
                </button>
              ))}
            </div>
          </div>

          {/* シチュエーションフィルタ */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              シチュエーション
            </label>
            <div className="flex flex-wrap gap-2">
              {SITUATIONS.map(situation => (
                <button
                  key={situation}
                  onClick={() => updateFilters({
                    ...filters,
                    situation: filters.situation === situation ? undefined : situation
                  })}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm transition-colors",
                    filters.situation === situation
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                  )}
                >
                  {situation}
                </button>
              ))}
            </div>
          </div>

          {/* 相手の技フィルタ */}
          {oppMoves.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                相手の技
              </label>
              <select
                value={filters.oppMove || ''}
                onChange={(e) => updateFilters({
                  ...filters,
                  oppMove: e.target.value || undefined
                })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <option value="">すべて</option>
                {oppMoves.map(move => (
                  <option key={move} value={move}>{move}</option>
                ))}
              </select>
            </div>
          )}

          {/* タグフィルタ */}
          {availableTags.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                タグ
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      const currentTags = filters.tags || []
                      const newTags = currentTags.includes(tag)
                        ? currentTags.filter(t => t !== tag)
                        : [...currentTags, tag]
                      updateFilters({
                        ...filters,
                        tags: newTags.length > 0 ? newTags : undefined
                      })
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm transition-colors",
                      filters.tags?.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 最近のフィルタ */}
          {recentFilters.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                最近のフィルタ
              </label>
              <div className="space-y-2">
                {recentFilters.map(recent => (
                  <button
                    key={recent.id}
                    onClick={() => applyRecentFilter(recent.filter)}
                    className="w-full text-left px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="text-sm">
                      {recent.filter.percentBand && <span className="mr-2">{recent.filter.percentBand}%</span>}
                      {recent.filter.situation && <span className="mr-2">{recent.filter.situation}</span>}
                      {recent.filter.oppMove && <span className="mr-2">vs {recent.filter.oppMove}</span>}
                      {recent.filter.tags && recent.filter.tags.map(tag => (
                        <span key={tag} className="mr-2">#{tag}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}