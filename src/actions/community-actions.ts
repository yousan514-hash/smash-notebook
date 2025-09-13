'use server'

import { supabase } from '@/src/lib/supabase'
import type { Card, Post, CommunityFilters } from '@/src/types/domain'

// Mock user ID for now - in a real app this would come from auth
const MOCK_USER_ID = 'user-1'

export async function getCommunityCards(character: string, filters: CommunityFilters = {}): Promise<Card[]> {
  try {
    let query = supabase
      .from('cards')
      .select('*')
      .or(`my_char.eq.${character},opp_char.eq.${character}`)

    // Apply filters
    if (filters.situation) {
      query = query.eq('situation', filters.situation)
    }

    if (filters.percentBand) {
      query = query.eq('percent_band', filters.percentBand)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        // For now, just order by created_at desc - in a real app you'd have engagement metrics
        query = query.order('created_at', { ascending: false })
        break
      case 'mostDiscussed':
        // For now, just order by updated_at desc - in a real app you'd join with comments/discussions
        query = query.order('updated_at', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    const { data: cards, error } = await query

    if (error) throw error

    return cards.map(card => ({
      id: card.id,
      myChar: card.my_char,
      oppChar: card.opp_char,
      percentBand: card.percent_band,
      situation: card.situation,
      oppMove: card.opp_move,
      answerMD: card.answer_md,
      createdAt: card.created_at,
      updatedAt: card.updated_at,
      userId: card.user_id,
    }))
  } catch (error) {
    console.error('Error fetching community cards:', error)
    return []
  }
}

export async function getCommunityPosts(character: string, filters: CommunityFilters = {}): Promise<Post[]> {
  try {
    // Get posts that have cards related to the character
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        post_cards (
          card_id,
          cards (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Filter posts that have cards related to the character
    const relevantPosts = posts.filter(post => 
      post.post_cards.some((pc: any) => 
        pc.cards.my_char === character || pc.cards.opp_char === character
      )
    )

    return relevantPosts.map(post => ({
      id: post.id,
      content: post.content,
      userId: post.user_id,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      cardIds: post.post_cards.map((pc: any) => pc.card_id),
      cards: post.post_cards
        .filter((pc: any) => pc.cards.my_char === character || pc.cards.opp_char === character)
        .map((pc: any) => ({
          id: pc.cards.id,
          myChar: pc.cards.my_char,
          oppChar: pc.cards.opp_char,
          percentBand: pc.cards.percent_band,
          situation: pc.cards.situation,
          oppMove: pc.cards.opp_move,
          answerMD: pc.cards.answer_md,
          createdAt: pc.cards.created_at,
          updatedAt: pc.cards.updated_at,
          userId: pc.cards.user_id,
        }))
    }))
  } catch (error) {
    console.error('Error fetching community posts:', error)
    return []
  }
}