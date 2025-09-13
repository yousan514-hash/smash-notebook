import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { getDecks } from '@/src/actions/deck-actions'
import { formatDate } from '@/src/lib/utils'
import { Plus, BookOpen } from 'lucide-react'

export default async function DecksPage() {
  const decks = await getDecks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Decks</h1>
          <p className="text-muted-foreground">
            Organize your tactics cards into decks
          </p>
        </div>
        <Button asChild>
          <Link href="/deck/new">
            <Plus className="h-4 w-4 mr-2" />
            New Deck
          </Link>
        </Button>
      </div>

      {decks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No decks yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first deck to start organizing your tactics cards
            </p>
            <Button asChild>
              <Link href="/deck/new">
                <Plus className="h-4 w-4 mr-2" />
                Create First Deck
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <Card key={deck.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <Link 
                    href={`/deck/${deck.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {deck.name}
                  </Link>
                  <span className="text-sm font-normal text-muted-foreground">
                    {deck.cards.length} cards
                  </span>
                </CardTitle>
                {deck.description && (
                  <CardDescription>{deck.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Created {formatDate(deck.createdAt)}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/deck/${deck.id}`}>
                      View Deck
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/deck/${deck.id}/card/new`}>
                      Add Card
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}