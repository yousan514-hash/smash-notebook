'use client'

import { useState, useEffect } from 'react'
import { Template } from '@prisma/client'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { MDXRenderer } from '@/components/mdx/mdx-renderer'
import { usePostHog } from 'posthog-js/react'

interface TemplateExpanderProps {
  targetChar: string
  deckId?: string
}

export function TemplateExpander({ targetChar, deckId }: TemplateExpanderProps) {
  const posthog = usePostHog()
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanding, setIsExpanding] = useState(false)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const params = new URLSearchParams()
        if (targetChar) params.set('targetChar', targetChar)
        
        const response = await fetch(`/api/templates?${params}`)
        if (!response.ok) throw new Error('Failed to fetch templates')
        
        const data = await response.json()
        setTemplates(data)
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [targetChar])

  const toggleTemplate = (templateId: string) => {
    const newSelected = new Set(selectedTemplates)
    if (newSelected.has(templateId)) {
      newSelected.delete(templateId)
    } else {
      newSelected.add(templateId)
    }
    setSelectedTemplates(newSelected)
  }

  const expandTemplates = async () => {
    if (selectedTemplates.size === 0 || !deckId) return

    setIsExpanding(true)
    try {
      const selectedList = templates.filter(t => selectedTemplates.has(t.id))
      
      const response = await fetch('/api/cards/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId,
          templates: selectedList.map(t => ({
            percentBand: t.percent,
            situation: t.section,
            oppMove: t.oppMove,
            answerMD: t.answerMD,
            tags: [t.section], // セクションを自動タグ付け
          })),
        }),
      })

      if (!response.ok) throw new Error('Failed to create cards')

      posthog?.capture('templates_expanded', {
        deckId,
        templateCount: selectedList.length,
        targetChar,
      })

      // 成功したらリセット
      setSelectedTemplates(new Set())
      alert(`${selectedList.length}件のカードを作成しました`)
    } catch (error) {
      console.error('Error expanding templates:', error)
      alert('カードの作成に失敗しました')
    } finally {
      setIsExpanding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        title="テンプレートがありません"
        description={targetChar ? `${targetChar}用のテンプレートが見つかりませんでした` : '自キャラを入力するとテンプレートが表示されます'}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">利用可能なテンプレート</h3>
        {deckId && selectedTemplates.size > 0 && (
          <button
            onClick={expandTemplates}
            disabled={isExpanding}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isExpanding ? '作成中...' : `${selectedTemplates.size}件を展開`}
          </button>
        )}
      </div>

      {templates.map(template => (
        <div
          key={template.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedTemplates.has(template.id)
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
          onClick={() => toggleTemplate(template.id)}
        >
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={selectedTemplates.has(template.id)}
              onChange={() => toggleTemplate(template.id)}
              className="mt-1"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{template.title}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {template.percent}% • {template.section}
                  {template.oppMove && ` • vs ${template.oppMove}`}
                </span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <MDXRenderer content={template.answerMD} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {!deckId && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          デッキを作成してからテンプレートを展開できます
        </p>
      )}
    </div>
  )
}