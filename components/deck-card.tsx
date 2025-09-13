import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MDXContent } from './mdx-content'
import type { Card as CardType } from '@/src/types/domain'

interface DeckCardProps {
  card: CardType
  showFullContent?: boolean
}

export function DeckCard({ card, showFullContent = false }: DeckCardProps) {
  const cardContent = showFullContent ? card.answerMD : card.answerMD.slice(0, 150) + (card.answerMD.length > 150 ? '...' : '')

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {card.myChar} vs {card.oppChar}
          </CardTitle>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs">
              {card.percentBand}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {card.situation}
            </Badge>
          </div>
        </div>
        {card.oppMove && (
          <p className="text-sm text-muted-foreground">
            vs {card.oppMove}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <MDXContent content={cardContent} />
        </div>
        {!showFullContent && card.answerMD.length > 150 && (
          <div className="mt-2">
            <Link 
              href={`/card/${card.id}`}
              className="text-sm text-primary hover:underline"
            >
              Read more →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}