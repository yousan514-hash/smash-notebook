import { Deck, Card, Post, Profile, Template, Tag } from '@prisma/client'

export type DeckWithCards = Deck & {
  cards: Card[]
  owner: Profile
}

export type CardWithDeck = Card & {
  deck: Deck
  owner: Profile
}

export type PostWithOwner = Post & {
  owner: Profile
}

export type TemplateWithOwner = Template & {
  owner: Profile
}

// フィルタ関連の型
export interface CardFilters {
  percentBand?: string
  situation?: string
  oppMove?: string
  tags?: string[]
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

// フォーム関連の型
export interface CardFormData {
  situation: string
  percentBand: string
  oppChar?: string
  oppMove?: string
  questionMD: string
  answerMD: string
  tags: string[]
}

export interface PostFormData {
  content: string
  isPublic: boolean
}

export interface DeckFormData {
  title: string
  description?: string
  isPublic: boolean
}

// テンプレート展開用の型
export interface TemplatePreview {
  id: string
  title: string
  targetChar: string
  section: string
  percent: string
  oppMove?: string
  answerMD: string
  selected: boolean
}

// PostからCard草稿作成用の型
export interface PostToCardDraft {
  postId: string
  deckId: string
  extractedData: {
    percentBands: string[]
    moveNames: string[]
    content: string
  }
}

// ローカルストレージ用の型
export interface RecentFilters {
  percentBands: string[]
  situations: string[]
  oppMoves: string[]
  tags: string[]
}

// Analytics用の型
export interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
}