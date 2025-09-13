import { Composer } from '@/components/composer'
import { Post } from '@/components/post'
import { getPosts } from '@/src/actions/post-actions'
import { getDecks } from '@/src/actions/deck-actions'

export default async function FeedPage() {
  const [posts, decks] = await Promise.all([
    getPosts(),
    getDecks()
  ])

  // Get all cards from all decks for the composer
  const availableCards = decks.flatMap(deck => deck.cards)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Feed</h1>
        <p className="text-muted-foreground">
          Share tactics, discuss strategies, and learn from the community
        </p>
      </div>

      <Composer availableCards={availableCards} />

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Be the first to share a tactic or start a discussion!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}