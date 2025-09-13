import { notFound } from 'next/navigation'
import { DeckPageClient } from './deck-page-client'
import { prisma } from '@/lib/prisma'

interface DeckPageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getDeck(id: string) {
  const deck = await prisma.deck.findUnique({
    where: { id },
    include: {
      owner: true,
      cards: {
        include: {
          owner: true,
          deck: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  return deck
}

async function getFilterOptions(deckId: string) {
  // デッキ内のカードから利用可能なフィルタオプションを取得
  const cards = await prisma.card.findMany({
    where: { deckId },
    select: {
      percentBand: true,
      situation: true,
      oppMove: true,
      tags: true,
    }
  })

  const percentBands = [...new Set(cards.map(c => c.percentBand))].map(value => ({
    value,
    label: value,
    count: cards.filter(c => c.percentBand === value).length
  }))

  const situations = [...new Set(cards.map(c => c.situation))].map(value => ({
    value,
    label: value,
    count: cards.filter(c => c.situation === value).length
  }))

  const oppMoves = [...new Set(cards.map(c => c.oppMove).filter(Boolean) as string[])].map(value => ({
    value,
    label: value,
    count: cards.filter(c => c.oppMove === value).length
  }))

  const allTags = cards.flatMap(c => c.tags)
  const tags = [...new Set(allTags)].map(value => ({
    value,
    label: value,
    count: allTags.filter(t => t === value).length
  }))

  return {
    percentBands,
    situations,
    oppMoves,
    tags,
  }
}

export default async function DeckPage({ params, searchParams }: DeckPageProps) {
  const deck = await getDeck(params.id)
  
  if (!deck) {
    notFound()
  }

  const filterOptions = await getFilterOptions(params.id)

  return (
    <DeckPageClient 
      deck={deck} 
      filterOptions={filterOptions}
      searchParams={searchParams}
    />
  )
}

export async function generateMetadata({ params }: DeckPageProps) {
  const deck = await getDeck(params.id)
  
  if (!deck) {
    return {
      title: 'デッキが見つかりません',
    }
  }

  return {
    title: `${deck.title} - スマブラ戦術ノート`,
    description: deck.description || `${deck.title}のカード一覧`,
  }
}