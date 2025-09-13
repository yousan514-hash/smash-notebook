import { User, Deck, Card, Post, Community, Character } from '@prisma/client'

export type { User, Deck, Card, Post, Community, Character }

export interface DeckWithCards extends Deck {
  cards: Card[]
  user: User
  character: Character
  _count?: {
    cards: number
  }
}

export interface PostWithUser extends Post {
  user: User
  deck?: Deck | null
  _count?: {
    likes: number
    comments: number
  }
}

export interface CommunityWithMembers extends Community {
  _count?: {
    members: number
    messages: number
  }
}

export type CardFormData = {
  myChar: string
  oppChar: string
  percentBand: string
  situation: string
  section: string
  oppMove?: string
  answerMD: string
  tags: string[]
}

export type DeckFormData = {
  title: string
  description?: string
  myCharacter: string
  isPublic: boolean
  tags: string[]
}