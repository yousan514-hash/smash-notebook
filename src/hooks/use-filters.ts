'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { CardFilters, RecentFilters } from '@/types'
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

const RECENT_FILTERS_KEY = 'smash-notebook-recent-filters'
const MAX_RECENT_ITEMS = 10

export function useFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL からフィルタを初期化
  const [filters, setFilters] = useState<CardFilters>(() => ({
    percentBand: searchParams.get('percentBand') || undefined,
    situation: searchParams.get('situation') || undefined,
    oppMove: searchParams.get('oppMove') || undefined,
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
  }))

  // 最近のフィルタをローカルストレージから取得
  const [recentFilters, setRecentFilters] = useState<RecentFilters>(() =>
    getLocalStorageItem<RecentFilters>(RECENT_FILTERS_KEY, {
      percentBands: [],
      situations: [],
      oppMoves: [],
      tags: [],
    })
  )

  // フィルタ変更時の処理
  const updateFilters = useCallback((newFilters: Partial<CardFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters }
      
      // 空の値を除去
      Object.keys(updated).forEach(key => {
        const value = updated[key as keyof CardFilters]
        if (value === '' || value === undefined || (Array.isArray(value) && value.length === 0)) {
          delete updated[key as keyof CardFilters]
        }
      })
      
      return updated
    })
  }, [])

  // URLを更新
  const updateURL = useCallback((newFilters: CardFilters) => {
    const params = new URLSearchParams()
    
    if (newFilters.percentBand) params.set('percentBand', newFilters.percentBand)
    if (newFilters.situation) params.set('situation', newFilters.situation)
    if (newFilters.oppMove) params.set('oppMove', newFilters.oppMove)
    if (newFilters.tags && newFilters.tags.length > 0) {
      params.set('tags', newFilters.tags.join(','))
    }

    const url = params.toString() ? `?${params.toString()}` : ''
    router.replace(url, { scroll: false })
  }, [router])

  // 最近のフィルタを更新
  const updateRecentFilters = useCallback((filters: CardFilters) => {
    setRecentFilters(prev => {
      const updated = { ...prev }
      
      // 各フィルタタイプを最近使用したものとして追加
      if (filters.percentBand) {
        updated.percentBands = [
          filters.percentBand,
          ...prev.percentBands.filter(item => item !== filters.percentBand)
        ].slice(0, MAX_RECENT_ITEMS)
      }
      
      if (filters.situation) {
        updated.situations = [
          filters.situation,
          ...prev.situations.filter(item => item !== filters.situation)
        ].slice(0, MAX_RECENT_ITEMS)
      }
      
      if (filters.oppMove) {
        updated.oppMoves = [
          filters.oppMove,
          ...prev.oppMoves.filter(item => item !== filters.oppMove)
        ].slice(0, MAX_RECENT_ITEMS)
      }
      
      if (filters.tags && filters.tags.length > 0) {
        const newTags = filters.tags.filter(tag => !prev.tags.includes(tag))
        updated.tags = [
          ...newTags,
          ...prev.tags
        ].slice(0, MAX_RECENT_ITEMS)
      }
      
      return updated
    })
  }, [])

  // フィルタが変更されたときの副作用
  useEffect(() => {
    updateURL(filters)
    updateRecentFilters(filters)
    
    // ローカルストレージに保存
    setLocalStorageItem(RECENT_FILTERS_KEY, recentFilters)
    
    // アナリティクス
    if (Object.keys(filters).length > 0) {
      trackEvent.filterChanged(filters)
    }
  }, [filters, recentFilters, updateURL, updateRecentFilters])

  // フィルタをクリア
  const clearFilters = useCallback(() => {
    setFilters({})
    router.replace('', { scroll: false })
  }, [router])

  // 特定のフィルタを削除
  const removeFilter = useCallback((key: keyof CardFilters, value?: string) => {
    setFilters(prev => {
      const updated = { ...prev }
      
      if (key === 'tags' && value && Array.isArray(updated.tags)) {
        updated.tags = updated.tags.filter(tag => tag !== value)
        if (updated.tags.length === 0) {
          delete updated.tags
        }
      } else {
        delete updated[key]
      }
      
      return updated
    })
  }, [])

  // アクティブなフィルタの数
  const activeFilterCount = Object.keys(filters).reduce((count, key) => {
    const value = filters[key as keyof CardFilters]
    if (Array.isArray(value)) {
      return count + value.length
    }
    return value ? count + 1 : count
  }, 0)

  return {
    filters,
    recentFilters,
    updateFilters,
    clearFilters,
    removeFilter,
    activeFilterCount,
  }
}