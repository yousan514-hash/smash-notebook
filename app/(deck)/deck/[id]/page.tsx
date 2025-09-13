import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DeckCard } from '@/components/deck-card'
import { getDeck } from '@/src/actions/deck-actions'
import { formatDate } from '@/src/lib/utils'
import { Plus, BookOpen, Edit } from 'lucide-react'

interface DeckPageProps {
  params: {
    id: string
  }
}

export default async function DeckPage({ params }: DeckPageProps) {
  const deck = await getDeck(params.id)

  if (!deck) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{deck.name}</h1>
          {deck.description && (
            <p className="text-muted-foreground mt-1">{deck.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Created {formatDate(deck.createdAt)} • {deck.cards.length} cards
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Deck
          </Button>
          <Button asChild>
            <Link href={`/deck/${deck.id}/card/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Link>
          </Button>
        </div>
      </div>

      {deck.cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cards in this deck</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first tactics card to get started
            </p>
            <Button asChild>
              <Link href={`/deck/${deck.id}/card/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Card
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deck.cards.map((card) => (
            <DeckCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}