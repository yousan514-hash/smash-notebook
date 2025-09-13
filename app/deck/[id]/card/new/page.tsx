import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { CardForm } from '@/components/card/card-form'

interface NewCardPageProps {
  params: { id: string }
}

export default async function NewCardPage({ params }: NewCardPageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <p className="text-center">ログインが必要です</p>
      </div>
    )
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <p className="text-center">プロフィールが見つかりません</p>
      </div>
    )
  }

  const deck = await prisma.deck.findUnique({
    where: { id: params.id },
    include: {
      cards: {
        select: { tags: true }
      }
    }
  })

  if (!deck || deck.ownerId !== profile.id) {
    notFound()
  }

  // 既存のタグを収集
  const allTags = await prisma.tag.findMany({
    select: { name: true },
    orderBy: { name: 'asc' }
  })
  
  const deckTags = [...new Set(deck.cards.flatMap(c => c.tags))]
  const availableTags = [...new Set([...allTags.map(t => t.name), ...deckTags])]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">新規カード作成</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        デッキ: {deck.title}
      </p>
      
      <CardForm deckId={deck.id} availableTags={availableTags} />
    </div>
  )
}