import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MDXContent } from '@/components/mdx-content'
import { getCard } from '@/src/actions/deck-actions'
import { formatDateTime } from '@/src/lib/utils'
import { ArrowLeft, Edit } from 'lucide-react'

interface CardPageProps {
  params: {
    id: string
  }
}

export default async function CardPage({ params }: CardPageProps) {
  const card = await getCard(params.id)

  if (!card) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/deck">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {card.myChar} vs {card.oppChar}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {card.percentBand}
              </Badge>
              <Badge variant="outline">
                {card.situation}
              </Badge>
            </div>
          </div>
          {card.oppMove && (
            <p className="text-muted-foreground">
              Against: {card.oppMove}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Created {formatDateTime(card.createdAt)}
            {card.updatedAt !== card.createdAt && (
              <span> • Updated {formatDateTime(card.updatedAt)}</span>
            )}
          </p>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <MDXContent content={card.answerMD} />
          </div>
          <div className="mt-6 pt-6 border-t flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Card
            </Button>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}