import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CHARACTERS } from '@/src/types/domain'
import { Users } from 'lucide-react'

export default function CommunitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Communities</h1>
        <p className="text-muted-foreground">
          Join character-specific communities to share tactics and learn from other players
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CHARACTERS.map((character) => (
          <Card key={character} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                <Link 
                  href={`/c/${encodeURIComponent(character)}`}
                  className="hover:text-primary transition-colors"
                >
                  {character}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Community</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {Math.floor(Math.random() * 500) + 50} members
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.floor(Math.random() * 20) + 5} posts today
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}