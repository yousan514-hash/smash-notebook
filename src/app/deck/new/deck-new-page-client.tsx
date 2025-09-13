'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TemplatePreview } from '@/components/templates/template-preview'
import { TemplatePreview as TemplatePreviewType } from '@/types'
import { Template, Profile } from '@prisma/client'
import { ArrowLeft, FileText, Sparkles } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type TemplateWithOwner = Template & { owner: Profile }

interface DeckNewPageClientProps {
  templates: TemplateWithOwner[]
}

export function DeckNewPageClient({ templates }: DeckNewPageClientProps) {
  const router = useRouter()
  const [step, setStep] = useState<'basic' | 'templates'>('basic')
  const [loading, setLoading] = useState(false)
  
  // 基本情報
  const [deckData, setDeckData] = useState({
    title: '',
    description: '',
    isPublic: false,
  })

  // テンプレートプレビュー
  const [templatePreviews, setTemplatePreviews] = useState<TemplatePreviewType[]>(
    templates.map(template => ({
      id: template.id,
      title: template.title,
      targetChar: template.targetChar,
      section: template.section,
      percent: template.percent,
      oppMove: template.oppMove || undefined,
      answerMD: template.answerMD,
      selected: false,
    }))
  )

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deckData.title.trim()) return
    
    if (templates.length > 0) {
      setStep('templates')
    } else {
      // テンプレートがない場合は直接作成
      createDeck([])
    }
  }

  const handleSkipTemplates = () => {
    createDeck([])
  }

  const handleCreateWithTemplates = (selectedTemplates: TemplatePreviewType[]) => {
    createDeck(selectedTemplates)
  }

  const createDeck = async (selectedTemplates: TemplatePreviewType[]) => {
    setLoading(true)
    try {
      // TODO: API呼び出しでデッキ作成
      // const response = await fetch('/api/decks', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...deckData,
      //     templates: selectedTemplates.map(t => t.id)
      //   })
      // })
      // const deck = await response.json()
      
      // 仮の処理
      const deckId = 'new-deck-id'
      
      // アナリティクス
      if (selectedTemplates.length > 0) {
        trackEvent.templateExpanded('bulk', selectedTemplates.length)
      }
      
      // デッキページに遷移
      router.push(`/deck/${deckId}`)
    } catch (error) {
      console.error('Failed to create deck:', error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'templates') {
    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep('basic')}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-2xl font-bold">テンプレートから展開</h1>
            <p className="text-muted-foreground">
              「{deckData.title}」にテンプレートからカードを追加できます
            </p>
          </div>
        </div>

        {/* テンプレートプレビュー */}
        <TemplatePreview
          templates={templatePreviews}
          onTemplatesChange={setTemplatePreviews}
          onCreateCards={handleCreateWithTemplates}
          loading={loading}
        />

        {/* スキップオプション */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleSkipTemplates}
            disabled={loading}
          >
            テンプレートを使わずに作成
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">新しいデッキを作成</h1>
        <p className="text-muted-foreground">
          スマブラの戦術をまとめるデッキを作成します
        </p>
      </div>

      {/* フォーム */}
      <form onSubmit={handleBasicSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              デッキ名 <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={deckData.title}
              onChange={(e) => setDeckData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="例: マリオ対策デッキ"
              className="w-full px-3 py-2 border rounded-lg bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              説明（任意）
            </label>
            <textarea
              id="description"
              value={deckData.description}
              onChange={(e) => setDeckData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="このデッキの目的や内容について..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg bg-background resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="isPublic"
              type="checkbox"
              checked={deckData.isPublic}
              onChange={(e) => setDeckData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="h-4 w-4"
            />
            <label htmlFor="isPublic" className="text-sm">
              公開デッキにする（他のユーザーが閲覧可能）
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={!deckData.title.trim() || loading}>
            {templates.length > 0 ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                テンプレートを選択
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                デッキを作成
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
        </div>

        {templates.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">テンプレートが利用可能です</p>
                <p className="text-xs text-muted-foreground">
                  {templates.length}件のテンプレートからカードを一括作成できます
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}