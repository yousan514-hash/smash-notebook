'use client'

import { useState } from 'react'
import { TemplatePreview as TemplatePreviewType } from '@/types'
import { Button } from '@/components/ui/button'
import { SafeMDX } from '@/components/mdx/safe-mdx'
import { Check, FileText, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TemplatePreviewProps {
  templates: TemplatePreviewType[]
  onTemplatesChange: (templates: TemplatePreviewType[]) => void
  onCreateCards: (selectedTemplates: TemplatePreviewType[]) => void
  loading?: boolean
}

export function TemplatePreview({ 
  templates, 
  onTemplatesChange, 
  onCreateCards,
  loading 
}: TemplatePreviewProps) {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)

  const handleToggleSelection = (templateId: string) => {
    const updated = templates.map(template => 
      template.id === templateId 
        ? { ...template, selected: !template.selected }
        : template
    )
    onTemplatesChange(updated)
  }

  const handleSelectAll = () => {
    const allSelected = templates.every(t => t.selected)
    const updated = templates.map(template => ({
      ...template,
      selected: !allSelected
    }))
    onTemplatesChange(updated)
  }

  const handleToggleExpand = (templateId: string) => {
    setExpandedTemplate(expandedTemplate === templateId ? null : templateId)
  }

  const selectedCount = templates.filter(t => t.selected).length
  const allSelected = templates.length > 0 && templates.every(t => t.selected)

  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>利用可能なテンプレートがありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">テンプレートプレビュー</h3>
          <p className="text-sm text-muted-foreground">
            作成したいカードにチェックを入れてください
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={loading}
          >
            <Check className="h-4 w-4 mr-2" />
            {allSelected ? 'すべて解除' : 'すべて選択'}
          </Button>
          
          <Button
            onClick={() => onCreateCards(templates.filter(t => t.selected))}
            disabled={selectedCount === 0 || loading}
          >
            {loading ? '作成中...' : `${selectedCount}件のカードを作成`}
          </Button>
        </div>
      </div>

      {/* テンプレート一覧 */}
      <div className="space-y-3">
        {templates.map(template => (
          <div
            key={template.id}
            className={cn(
              'border rounded-lg transition-colors',
              template.selected && 'border-primary bg-primary/5'
            )}
          >
            <div className="p-4">
              {/* テンプレートヘッダー */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleSelection(template.id)}
                  className={cn(
                    'mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors tap-target',
                    template.selected 
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-input hover:border-primary'
                  )}
                  disabled={loading}
                >
                  {template.selected && <Check className="h-3 w-3" />}
                </button>
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{template.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleExpand(template.id)}
                      className="h-8 w-8 p-0"
                    >
                      {expandedTemplate === template.id ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 text-sm">
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                      {template.targetChar}
                    </span>
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                      {template.section}
                    </span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {template.percent}
                    </span>
                    {template.oppMove && (
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full">
                        vs {template.oppMove}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 展開された内容 */}
              {expandedTemplate === template.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm text-muted-foreground mb-2">
                        回答テンプレート
                      </h5>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <SafeMDX content={template.answerMD} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      {selectedCount > 0 && (
        <div className="bg-muted/50 rounded-lg p-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {selectedCount}件のテンプレートが選択されています
          </span>
          <Button
            onClick={() => onCreateCards(templates.filter(t => t.selected))}
            disabled={loading}
          >
            {loading ? '作成中...' : 'カードを作成'}
          </Button>
        </div>
      )}
    </div>
  )
}