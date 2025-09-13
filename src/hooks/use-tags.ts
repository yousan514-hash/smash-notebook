'use client'

import { useState, useEffect, useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'

interface UseTagsProps {
  initialTags?: string[]
  onTagsChange?: (tags: string[]) => void
}

interface TagSuggestion {
  name: string
  count: number
}

export function useTags({ initialTags = [], onTagsChange }: UseTagsProps = {}) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  // タグ変更時の処理
  const updateTags = useCallback((newTags: string[]) => {
    setTags(newTags)
    onTagsChange?.(newTags)
    
    // 新しいタグが追加された場合の分析
    const addedTags = newTags.filter(tag => !tags.includes(tag))
    addedTags.forEach(tag => {
      trackEvent.tagAdded(tag)
    })
  }, [tags, onTagsChange])

  // サジェストを取得
  const fetchSuggestions = useCallback(async (query?: string) => {
    setLoading(true)
    try {
      // TODO: APIからサジェストを取得
      // const response = await fetch(`/api/tags/suggestions?q=${query || ''}`)
      // const data = await response.json()
      // setSuggestions(data.suggestions)
      
      // 仮のサジェストデータ
      const mockSuggestions: TagSuggestion[] = [
        { name: '立ち回り', count: 15 },
        { name: '崖展開', count: 12 },
        { name: '復帰阻止', count: 8 },
        { name: 'コンボ', count: 10 },
        { name: 'バースト', count: 6 },
        { name: '着地狩り', count: 9 },
        { name: '起き攻め', count: 5 },
        { name: '対空', count: 7 },
        { name: '読み', count: 4 },
        { name: '択', count: 3 },
      ]
      
      const filtered = query 
        ? mockSuggestions.filter(s => s.name.includes(query))
        : mockSuggestions
        
      setSuggestions(filtered)
    } catch (error) {
      console.error('Failed to fetch tag suggestions:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 初回ロード時にサジェストを取得
  useEffect(() => {
    fetchSuggestions()
  }, [fetchSuggestions])

  // タグを追加
  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      updateTags([...tags, trimmedTag])
    }
  }, [tags, updateTags])

  // タグを削除
  const removeTag = useCallback((tagToRemove: string) => {
    updateTags(tags.filter(tag => tag !== tagToRemove))
  }, [tags, updateTags])

  // 複数タグを追加（自動タグ付け用）
  const addMultipleTags = useCallback((newTags: string[]) => {
    const uniqueNewTags = newTags.filter(tag => !tags.includes(tag))
    if (uniqueNewTags.length > 0) {
      updateTags([...tags, ...uniqueNewTags])
    }
  }, [tags, updateTags])

  // すべてクリア
  const clearTags = useCallback(() => {
    updateTags([])
  }, [updateTags])

  // 人気のタグを取得
  const getPopularTags = useCallback(() => {
    return suggestions
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(s => s.name)
  }, [suggestions])

  return {
    tags,
    suggestions: suggestions.map(s => s.name),
    loading,
    addTag,
    removeTag,
    addMultipleTags,
    clearTags,
    updateTags,
    fetchSuggestions,
    getPopularTags,
  }
}