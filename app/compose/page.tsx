import { redirect } from 'next/navigation'
import { Composer } from '@/components/composer'
import { getDecks } from '@/src/actions/deck-actions'

export default async function ComposePage() {
  const decks = await getDecks()
  const availableCards = decks.flatMap(deck => deck.cards)

  // Redirect to feed after successful post creation
  const handleSuccess = () => {
    redirect('/')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create Post</h1>
        <p className="text-muted-foreground">
          Share your tactics and insights with the community
        </p>
      </div>

      <Composer availableCards={availableCards} onSuccess={handleSuccess} />
    </div>
  )
}