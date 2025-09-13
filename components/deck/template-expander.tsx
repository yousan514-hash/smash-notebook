'use client'

import { useState } from 'react'
import { trackTemplateUsed } from '../../lib/analytics'

interface Template {
  id: string
  title: string
  targetChar: string
  section: string
  percent: string
  oppMove?: string
  answerMD: string
}

interface TemplateExpanderProps {
  templates: Template[]
  onCardsCreate: (cards: Partial<Card>[]) => void
}

interface Card {
  title: string
  question: string
  answerMD: string
  percentBand: string
  situation: string
  oppMove?: string
  tags: string[]
}

export function TemplateExpander({ templates, onCardsCreate }: TemplateExpanderProps) {
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set())
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleTemplate = (templateId: string) => {
    const newSelected = new Set(selectedTemplates)
    if (newSelected.has(templateId)) {
      newSelected.delete(templateId)
    } else {
      newSelected.add(templateId)
    }
    setSelectedTemplates(newSelected)
  }

  const expandTemplates = () => {
    const selectedTemplateObjects = templates.filter(t => selectedTemplates.has(t.id))
    
    const cards: Partial<Card>[] = selectedTemplateObjects.map(template => ({
      title: template.title,
      question: `${template.targetChar}の${template.section}について`,
      answerMD: template.answerMD,
      percentBand: template.percent,
      situation: template.section,
      oppMove: template.oppMove,
      tags: [template.section, template.targetChar]
    }))

    onCardsCreate(cards)
    
    // Track usage
    trackTemplateUsed(template.id, cards.length)
    
    setIsExpanded(false)
    setSelectedTemplates(new Set())
  }

  const previewTemplate = (template: Template) => {
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{template.title}</h4>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {template.targetChar}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {template.section}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              {template.percent}%
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>質問:</strong> {template.targetChar}の{template.section}について
        </div>
        <div className="text-sm text-gray-600">
          <strong>回答:</strong> {template.answerMD.substring(0, 100)}
          {template.answerMD.length > 100 && '...'}
        </div>
        {template.oppMove && (
          <div className="text-sm text-gray-600 mt-1">
            <strong>相手の技:</strong> {template.oppMove}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">テンプレートから展開</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px]"
        >
          {isExpanded ? '閉じる' : '00テンプレを展開'}
        </button>
      </div>

      {isExpanded && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            テンプレートを選択してカードの下書きを作成します。複数選択可能です。
          </p>

          <div className="space-y-3 mb-4">
            {templates.map(template => (
              <div key={template.id} className="border rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`template-${template.id}`}
                    checked={selectedTemplates.has(template.id)}
                    onChange={() => toggleTemplate(template.id)}
                    className="mt-1 min-h-[44px] min-w-[44px]"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`template-${template.id}`}
                      className="cursor-pointer"
                    >
                      {previewTemplate(template)}
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={expandTemplates}
              disabled={selectedTemplates.size === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              選択したテンプレートからカード作成 ({selectedTemplates.size}個)
            </button>
            <button
              onClick={() => {
                setSelectedTemplates(new Set())
                setIsExpanded(false)
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px]"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  )
}