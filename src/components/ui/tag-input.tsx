'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface TagInputProps {
  tags: string[]
  suggestions: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  className?: string
}

export function TagInput({ 
  tags, 
  suggestions, 
  onChange, 
  placeholder = "タグを追加...",
  maxTags,
  className 
}: TagInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // フィルタされたサジェスト
  const filteredSuggestions = suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(input.toLowerCase()) &&
      !tags.includes(suggestion)
    )
    .slice(0, 10) // 最大10件まで表示

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && (!maxTags || tags.length < maxTags)) {
      onChange([...tags, trimmedTag])
      setInput('')
      setShowSuggestions(false)
      setFocusedSuggestionIndex(-1)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (focusedSuggestionIndex >= 0 && filteredSuggestions[focusedSuggestionIndex]) {
          addTag(filteredSuggestions[focusedSuggestionIndex])
        } else if (input.trim()) {
          addTag(input.trim())
        }
        break
      case 'Backspace':
        if (!input && tags.length > 0) {
          removeTag(tags[tags.length - 1])
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Escape':
        setShowSuggestions(false)
        setFocusedSuggestionIndex(-1)
        break
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    setShowSuggestions(value.length > 0)
    setFocusedSuggestionIndex(-1)
  }

  const handleInputFocus = () => {
    if (input) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // 少し遅延させてサジェストのクリックを可能にする
    setTimeout(() => {
      setShowSuggestions(false)
      setFocusedSuggestionIndex(-1)
    }, 200)
  }

  // 自動タグ付けのヘルパー
  const getAutoTags = (situation: string): string[] => {
    const autoTagMap: Record<string, string[]> = {
      '立ち回り': ['立ち回り', '中距離', '基本'],
      '崖展開': ['崖', '復帰', '展開'],
      '復帰阻止': ['復帰阻止', '崖外', '撃墜'],
      'コンボ': ['コンボ', '連携', 'ダメージ'],
      'バースト': ['撃墜', 'キル', 'フィニッシュ'],
      '着地狩り': ['着地狩り', '対空', '読み'],
      '起き攻め': ['起き攻め', 'ダウン', '択'],
    }

    return autoTagMap[situation] || []
  }

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-background min-h-[2.5rem]">
        {/* 既存のタグ */}
        {tags.map(tag => (
          <div
            key={tag}
            className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-primary/80 rounded-full p-0.5 tap-target"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* 入力フィールド */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={maxTags ? tags.length >= maxTags : false}
          className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground"
        />

        {/* 追加ボタン */}
        {input.trim() && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => addTag(input.trim())}
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* サジェスト */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              className={cn(
                'w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
                index === focusedSuggestionIndex && 'bg-accent text-accent-foreground'
              )}
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* 制限表示 */}
      {maxTags && (
        <div className="text-xs text-muted-foreground mt-1">
          {tags.length} / {maxTags} タグ
        </div>
      )}
    </div>
  )
}

// 自動タグ付けのヘルパー関数をエクスポート
export function getAutoTags(situation: string): string[] {
  const autoTagMap: Record<string, string[]> = {
    '立ち回り': ['立ち回り', '中距離', '基本'],
    '崖展開': ['崖', '復帰', '展開'],
    '復帰阻止': ['復帰阻止', '崖外', '撃墜'],
    'コンボ': ['コンボ', '連携', 'ダメージ'],
    'バースト': ['撃墜', 'キル', 'フィニッシュ'],
    '着地狩り': ['着地狩り', '対空', '読み'],
    '起き攻め': ['起き攻め', 'ダウン', '択'],
  }

  return autoTagMap[situation] || []
}