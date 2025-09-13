import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeckCard } from './deck-card'
import { formatDateTime } from '@/src/lib/utils'
import type { Post as PostType } from '@/src/types/domain'
import { MessageCircle, Heart, Share } from 'lucide-react'

interface PostProps {
  post: PostType
}

export function Post({ post }: PostProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
              U
            </div>
            <div>
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Post Content */}
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Attached Cards */}
        {post.cards && post.cards.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">
              Attached Cards ({post.cards.length})
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {post.cards.map((card) => (
                <div key={card.id} className="border rounded-lg">
                  <DeckCard card={card} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center space-x-4 pt-2 border-t">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Heart className="h-4 w-4 mr-2" />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}