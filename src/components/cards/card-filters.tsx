'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Filter, ChevronDown } from 'lucide-react'
import { useFilters } from '@/hooks/use-filters'
import { cn } from '@/lib/utils'
import { CardFilters as CardFiltersType, FilterOption } from '@/types'

interface CardFiltersProps {
  availableFilters: {
    percentBands: FilterOption[]
    situations: FilterOption[]
    oppMoves: FilterOption[]
    tags: FilterOption[]
  }
}

export function CardFilters({ availableFilters }: CardFiltersProps) {
  const { filters, recentFilters, updateFilters, clearFilters, removeFilter, activeFilterCount } = useFilters()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const filterSections = [
    {
      key: 'percentBand' as keyof CardFiltersType,
      label: '%帯',
      options: availableFilters.percentBands,
      recent: recentFilters.percentBands.map(item => ({ value: item, label: item })),
    },
    {
      key: 'situation' as keyof CardFiltersType,
      label: 'シチュエーション',
      options: availableFilters.situations,
      recent: recentFilters.situations.map(item => ({ value: item, label: item })),
    },
    {
      key: 'oppMove' as keyof CardFiltersType,
      label: '相手の技',
      options: availableFilters.oppMoves,
      recent: recentFilters.oppMoves.map(item => ({ value: item, label: item })),
    },
    {
      key: 'tags' as keyof CardFiltersType,
      label: 'タグ',
      options: availableFilters.tags,
      recent: recentFilters.tags.map(item => ({ value: item, label: item })),
    },
  ]

  const handleFilterSelect = (key: keyof CardFiltersType, value: string) => {
    if (key === 'tags') {
      const currentTags = filters.tags || []
      const newTags = currentTags.includes(value)
        ? currentTags.filter(tag => tag !== value)
        : [...currentTags, value]
      updateFilters({ [key]: newTags })
    } else {
      const currentValue = filters[key]
      updateFilters({ [key]: currentValue === value ? undefined : value })
    }
  }

  const isFilterActive = (key: keyof CardFiltersType, value: string) => {
    if (key === 'tags') {
      return filters.tags?.includes(value) || false
    }
    return filters[key] === value
  }

  return (
    <div className="space-y-4">
      {/* アクティブフィルタ表示 */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">フィルタ中:</span>
          
          {filters.percentBand && (
            <div className="filter-chip active">
              {filters.percentBand}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('percentBand')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {filters.situation && (
            <div className="filter-chip active">
              {filters.situation}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('situation')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {filters.oppMove && (
            <div className="filter-chip active">
              {filters.oppMove}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('oppMove')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {filters.tags?.map(tag => (
            <div key={tag} className="filter-chip active">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('tags', tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" size="sm" onClick={clearFilters}>
            すべてクリア
          </Button>
        </div>
      )}

      {/* フィルタセクション */}
      <div className="border rounded-lg">
        <Button
          variant="ghost"
          className="w-full justify-between p-4 h-auto"
          onClick={() => setExpandedSection(expandedSection ? null : 'filters')}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>フィルタ</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            expandedSection === 'filters' && "rotate-180"
          )} />
        </Button>

        {expandedSection === 'filters' && (
          <div className="border-t p-4 space-y-6">
            {filterSections.map(section => (
              <div key={section.key} className="space-y-3">
                <h4 className="font-medium text-sm">{section.label}</h4>
                
                {/* 最近使用したフィルタ */}
                {section.recent.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">最近使用</p>
                    <div className="flex flex-wrap gap-2">
                      {section.recent.slice(0, 5).map(option => (
                        <button
                          key={option.value}
                          className={cn(
                            'filter-chip',
                            isFilterActive(section.key, option.value) && 'active'
                          )}
                          onClick={() => handleFilterSelect(section.key, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* すべてのオプション */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">すべて</p>
                  <div className="flex flex-wrap gap-2">
                    {section.options.map(option => (
                      <button
                        key={option.value}
                        className={cn(
                          'filter-chip',
                          isFilterActive(section.key, option.value) && 'active'
                        )}
                        onClick={() => handleFilterSelect(section.key, option.value)}
                      >
                        {option.label}
                        {option.count && (
                          <span className="ml-1 text-xs opacity-70">
                            ({option.count})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}