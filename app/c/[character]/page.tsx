'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DeckCard } from '@/components/deck-card'
import { Post } from '@/components/post'
import { CommunityFilters } from '@/components/community-filters'
import { getCommunityCards, getCommunityPosts } from '@/src/actions/community-actions'
import { CHARACTERS } from '@/src/types/domain'
import type { Card as CardType, Post as PostType, CommunityFilters as Filters } from '@/src/types/domain'
import { Users, BookOpen, MessageSquare } from 'lucide-react'

interface CommunityPageProps {
  params: {
    character: string
  }
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const character = decodeURIComponent(params.character)
  const [cards, setCards] = useState<CardType[]>([])
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({ sortBy: 'newest' })

  if (!CHARACTERS.includes(character as any)) {
    notFound()
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [cardsData, postsData] = await Promise.all([
          getCommunityCards(character, filters),
          getCommunityPosts(character, filters)
        ])
        setCards(cardsData)
        setPosts(postsData)
      } catch (error) {
        console.error('Error loading community data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [character, filters])

  const memberCount = Math.floor(Math.random() * 500) + 50
  const todayPosts = Math.floor(Math.random() * 20) + 5

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{character} Community</h1>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{memberCount} members</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{todayPosts} posts today</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Community
        </Badge>
      </div>

      {/* Filters */}
      <CommunityFilters filters={filters} onFiltersChange={setFilters} />

      {/* Content Tabs */}
      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Cards ({cards.length})</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Posts ({posts.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          {loading ? (
            <div className="text-center py-8">Loading cards...</div>
          ) : cards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No cards found</h3>
                <p className="text-muted-foreground text-center">
                  No tactics cards found for {character} with the current filters.
                  Try adjusting your filters or be the first to create one!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <DeckCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts">
          {loading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground text-center">
                  No posts found for {character} with the current filters.
                  Be the first to start a discussion!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}