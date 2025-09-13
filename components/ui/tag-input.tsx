'use client'

import { useState, useEffect, useRef } from 'react'
import { prisma } from '../../lib/prisma'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  autoTagSections?: boolean
  situation?: string
}

const SECTION_TAGS = {
  '立ち回り': ['立ち回り', 'ニュートラル', '基本'],
  '崖展開': ['崖展開', 'エッジガード', '崖'],
  '回復': ['回復', 'リカバリー', '崖'],
  'コンボ': ['コンボ', '連続技', 'ダメージ'],
  'ガード': ['ガード', '防御', 'シールド'],
  'その他': ['その他', '特殊']
}

export function TagInput({ 
  value, 
  onChange, 
  suggestions = [], 
  autoTagSections = true,
  situation 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [allSuggestions, setAllSuggestions] = useState<string[]>([])

  // Load suggestions from database
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const response = await fetch('/api/tags')
        if (response.ok) {
          const tags = await response.json()
          setAllSuggestions(tags.map((tag: any) => tag.name))
        }
      } catch (error) {
        console.error('Failed to load tag suggestions:', error)
      }
    }
    loadSuggestions()
  }, [])

  // Auto-tag sections when situation changes
  useEffect(() => {
    if (autoTagSections && situation && SECTION_TAGS[situation as keyof typeof SECTION_TAGS]) {
      const sectionTags = SECTION_TAGS[situation as keyof typeof SECTION_TAGS]
      const newTags = [...value]
      
      sectionTags.forEach(tag => {
        if (!newTags.includes(tag)) {
          newTags.push(tag)
        }
      })
      
      if (newTags.length !== value.length) {
        onChange(newTags)
      }
    }
  }, [situation, autoTagSections, value, onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    
    if (val.length > 0) {
      const filtered = [...allSuggestions, ...suggestions]
        .filter(tag => 
          tag.toLowerCase().includes(val.toLowerCase()) && 
          !value.includes(tag)
        )
        .slice(0, 10)
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !value.includes(tag.trim())) {
      onChange([...value, tag.trim()])
    }
    setInputValue('')
    setShowSuggestions(false)
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setInputValue('')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion)
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-blue-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`${tag}を削除`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.length > 0) {
              setShowSuggestions(true)
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow clicking
            setTimeout(() => setShowSuggestions(false), 200)
          }}
          placeholder="タグを入力..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredSuggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors min-h-[44px]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick tag buttons */}
      <div className="mt-2">
        <p className="text-sm text-gray-600 mb-2">よく使うタグ:</p>
        <div className="flex flex-wrap gap-2">
          {['基本', '重要', '応用', '初心者向け', '上級者向け'].map(quickTag => (
            <button
              key={quickTag}
              onClick={() => addTag(quickTag)}
              disabled={value.includes(quickTag)}
              className={`px-3 py-1 text-sm rounded-full transition-colors min-h-[44px] ${
                value.includes(quickTag)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {quickTag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}