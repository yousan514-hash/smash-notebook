import { notFound } from 'next/navigation'
import { CardForm } from '@/components/card-form'
import { getDeck } from '@/src/actions/deck-actions'

interface NewCardPageProps {
  params: {
    id: string
  }
}

export default async function NewCardPage({ params }: NewCardPageProps) {
  const deck = await getDeck(params.id)

  if (!deck) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add Card to {deck.name}</h1>
        <p className="text-muted-foreground">
          Create a new tactics card for this deck
        </p>
      </div>

      <CardForm deckId={deck.id} />
    </div>
  )
}