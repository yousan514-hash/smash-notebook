// Core domain types for Smash Notebook

export type PercentBand = '0-30' | '40-70' | '80+' | 'Kill%'

export type Situation = 'neutral' | 'ledgetrap' | 'edgeguard' | 'recovery' | 'combo' | 'line'

export interface Card {
  id: string
  myChar: string
  oppChar: string
  percentBand: PercentBand
  situation: Situation
  oppMove?: string
  answerMD: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Deck {
  id: string
  name: string
  description?: string
  userId: string
  createdAt: string
  updatedAt: string
  cards: Card[]
}

export interface Post {
  id: string
  content: string
  userId: string
  createdAt: string
  updatedAt: string
  cardIds: string[]
  cards?: Card[]
}

export interface Community {
  id: string
  character: string
  name: string
  description?: string
  createdAt: string
  memberCount: number
}

export interface Quiz {
  id: string
  cardId: string
  card?: Card
  attempts: QuizAttempt[]
}

export interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  answer: string
  isCorrect: boolean
  createdAt: string
}

// Form types
export interface CardFormData {
  myChar: string
  oppChar: string
  percentBand: PercentBand
  situation: Situation
  oppMove?: string
  answerMD: string
}

export interface DeckFormData {
  name: string
  description?: string
}

export interface PostFormData {
  content: string
  cardIds: string[]
}

// Filter/Sort types
export interface CommunityFilters {
  tags?: string[]
  situation?: Situation
  percentBand?: PercentBand
  sortBy?: 'newest' | 'popular' | 'mostDiscussed'
}

// Character list - common Smash characters
export const CHARACTERS = [
  'Mario', 'Donkey Kong', 'Link', 'Samus', 'Dark Samus', 'Yoshi', 'Kirby', 'Fox', 'Pikachu', 'Luigi',
  'Ness', 'Captain Falcon', 'Jigglypuff', 'Peach', 'Daisy', 'Bowser', 'Ice Climbers', 'Sheik', 'Zelda',
  'Dr. Mario', 'Pichu', 'Falco', 'Marth', 'Lucina', 'Young Link', 'Ganondorf', 'Mewtwo', 'Roy', 'Chrom',
  'Mr. Game & Watch', 'Meta Knight', 'Pit', 'Dark Pit', 'Zero Suit Samus', 'Wario', 'Snake', 'Ike',
  'Pokemon Trainer', 'Diddy Kong', 'Lucas', 'Sonic', 'King Dedede', 'Olimar', 'Lucario', 'R.O.B.',
  'Toon Link', 'Wolf', 'Villager', 'Mega Man', 'Wii Fit Trainer', 'Rosalina & Luma', 'Little Mac',
  'Greninja', 'Mii Brawler', 'Mii Swordfighter', 'Mii Gunner', 'Palutena', 'Pac-Man', 'Robin',
  'Shulk', 'Bowser Jr.', 'Duck Hunt', 'Ryu', 'Ken', 'Cloud', 'Corrin', 'Bayonetta', 'Inkling',
  'Ridley', 'Simon', 'Richter', 'King K. Rool', 'Isabelle', 'Incineroar', 'Piranha Plant',
  'Joker', 'Hero', 'Banjo & Kazooie', 'Terry', 'Byleth', 'Min Min', 'Steve', 'Sephiroth',
  'Pyra/Mythra', 'Kazuya', 'Sora'
] as const

export type Character = typeof CHARACTERS[number]