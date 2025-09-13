'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DeckCard } from './deck-card'
import { createPost } from '@/src/actions/post-actions'
import type { Card as CardType, PostFormData } from '@/src/types/domain'
import { X, Plus } from 'lucide-react'

interface ComposerProps {
  onSuccess?: () => void
  availableCards?: CardType[]
}

export function Composer({ onSuccess, availableCards = [] }: ComposerProps) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [showCardSelector, setShowCardSelector] = useState(false)

  const selectedCards = availableCards.filter(card => 
    selectedCardIds.includes(card.id)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    try {
      const postData: PostFormData = {
        content: content.trim(),
        cardIds: selectedCardIds,
      }

      const result = await createPost(postData)
      
      if (result.success) {
        setContent('')
        setSelectedCardIds([])
        setShowCardSelector(false)
        if (onSuccess) {
          onSuccess()
        }
      } else {
        alert(result.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const handleCardToggle = (cardId: string) => {
    setSelectedCardIds(prev => 
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    )
  }

  const removeCard = (cardId: string) => {
    setSelectedCardIds(prev => prev.filter(id => id !== cardId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share a Tactic</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, ask questions, or discuss tactics..."
            rows={4}
            required
          />

          {/* Selected Cards */}
          {selectedCards.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Attached Cards</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCards.map((card) => (
                  <div key={card.id} className="relative">
                    <Badge 
                      variant="secondary" 
                      className="pr-6 cursor-pointer"
                      onClick={() => removeCard(card.id)}
                    >
                      {card.myChar} vs {card.oppChar} ({card.situation})
                      <X className="h-3 w-3 ml-1 absolute right-1 top-1/2 -translate-y-1/2" />
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card Selector */}
          {showCardSelector && availableCards.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Select Cards to Attach</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCardSelector(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {availableCards.map((card) => (
                  <div
                    key={card.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedCardIds.includes(card.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleCardToggle(card.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {card.myChar} vs {card.oppChar}
                      </span>
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
                      <p className="text-xs text-muted-foreground">
                        vs {card.oppMove}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={loading || !content.trim()}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
            
            {availableCards.length > 0 && !showCardSelector && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCardSelector(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Attach Cards
              </Button>
            )}

            <div className="text-xs text-muted-foreground ml-auto">
              {selectedCardIds.length > 0 && (
                <span>{selectedCardIds.length} card{selectedCardIds.length !== 1 ? 's' : ''} attached</span>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}