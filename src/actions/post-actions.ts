'use server'

import { supabase } from '@/src/lib/supabase'
import { revalidatePath } from 'next/cache'
import type { Post, PostFormData } from '@/src/types/domain'

// Mock user ID for now - in a real app this would come from auth
const MOCK_USER_ID = 'user-1'

export async function createPost(data: PostFormData) {
  try {
    // Create the post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        content: data.content,
        user_id: MOCK_USER_ID,
      })
      .select()
      .single()

    if (postError) throw postError

    // Link cards to the post
    if (data.cardIds.length > 0) {
      const postCards = data.cardIds.map(cardId => ({
        post_id: post.id,
        card_id: cardId,
      }))

      const { error: linkError } = await supabase
        .from('post_cards')
        .insert(postCards)

      if (linkError) throw linkError
    }

    revalidatePath('/')
    return { success: true, data: post }
  } catch (error) {
    console.error('Error creating post:', error)
    return { success: false, error: 'Failed to create post' }
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
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

    return posts.map(post => ({
      id: post.id,
      content: post.content,
      userId: post.user_id,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      cardIds: post.post_cards.map((pc: any) => pc.card_id),
      cards: post.post_cards.map((pc: any) => ({
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
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function deletePost(id: string) {
  try {
    // Delete post_cards relationships first
    await supabase
      .from('post_cards')
      .delete()
      .eq('post_id', id)

    // Delete the post
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)

    if (error) throw error

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}