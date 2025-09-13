'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { CommunityFilters, Situation, PercentBand } from '@/src/types/domain'
import { Filter, X } from 'lucide-react'

interface CommunityFiltersProps {
  filters: CommunityFilters
  onFiltersChange: (filters: CommunityFilters) => void
}

const SITUATIONS: Situation[] = ['neutral', 'ledgetrap', 'edgeguard', 'recovery', 'combo', 'line']
const PERCENT_BANDS: PercentBand[] = ['0-30', '40-70', '80+', 'Kill%']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'mostDiscussed', label: 'Most Discussed' },
] as const

export function CommunityFilters({ filters, onFiltersChange }: CommunityFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSituationChange = (situation: Situation | '') => {
    onFiltersChange({
      ...filters,
      situation: situation || undefined,
    })
  }

  const handlePercentBandChange = (percentBand: PercentBand | '') => {
    onFiltersChange({
      ...filters,
      percentBand: percentBand || undefined,
    })
  }

  const handleSortChange = (sortBy: CommunityFilters['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'newest',
    })
  }

  const hasActiveFilters = filters.situation || filters.percentBand || (filters.tags && filters.tags.length > 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Active
            </Badge>
          )}
        </Button>

        <Select
          value={filters.sortBy || 'newest'}
          onChange={(e) => handleSortChange(e.target.value as CommunityFilters['sortBy'])}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {showFilters && (
        <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Situation
              </label>
              <Select
                value={filters.situation || ''}
                onChange={(e) => handleSituationChange(e.target.value as Situation)}
              >
                <option value="">All Situations</option>
                {SITUATIONS.map((situation) => (
                  <option key={situation} value={situation}>
                    {situation.charAt(0).toUpperCase() + situation.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Percent Band
              </label>
              <Select
                value={filters.percentBand || ''}
                onChange={(e) => handlePercentBandChange(e.target.value as PercentBand)}
              >
                <option value="">All Percents</option>
                {PERCENT_BANDS.map((band) => (
                  <option key={band} value={band}>
                    {band}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <div className="flex gap-1">
                  {filters.situation && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.situation}
                    </Badge>
                  )}
                  {filters.percentBand && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.percentBand}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}