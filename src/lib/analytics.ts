import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window === 'undefined') return
  
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
  
  if (posthogKey && posthogHost) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
    })
  }
}

// イベント追跡のヘルパー関数
export const trackEvent = {
  cardCreated: (deckId: string) => {
    posthog.capture('card_created', { deck_id: deckId })
  },
  cardUpdated: (cardId: string) => {
    posthog.capture('card_updated', { card_id: cardId })
  },
  tagAdded: (tag: string) => {
    posthog.capture('tag_added', { tag })
  },
  filterChanged: (filters: Record<string, any>) => {
    posthog.capture('filter_changed', filters)
  },
  postCreated: (postId: string) => {
    posthog.capture('post_created', { post_id: postId })
  },
  postToCardDraft: (postId: string, deckId: string) => {
    posthog.capture('post_to_card_draft', { post_id: postId, deck_id: deckId })
  },
  templateExpanded: (templateId: string, cardCount: number) => {
    posthog.capture('template_expanded', { template_id: templateId, card_count: cardCount })
  }
}