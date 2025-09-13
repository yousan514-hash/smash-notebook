import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
  }
}

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(event, properties)
  }
}

// Common events
export const trackCardCreated = (deckId: string, cardId: string) => {
  trackEvent('card_created', { deck_id: deckId, card_id: cardId })
}

export const trackTagAdded = (cardId: string, tag: string) => {
  trackEvent('tag_added', { card_id: cardId, tag })
}

export const trackFilterChanged = (filterType: string, value: string) => {
  trackEvent('filter_changed', { filter_type: filterType, value })
}

export const trackPostCreated = (postId: string) => {
  trackEvent('post_created', { post_id: postId })
}

export const trackTemplateUsed = (templateId: string, cardsCreated: number) => {
  trackEvent('template_used', { template_id: templateId, cards_created: cardsCreated })
}