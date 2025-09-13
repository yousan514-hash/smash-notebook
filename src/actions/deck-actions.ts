'use server'

import { supabase } from '@/src/lib/supabase'
import { revalidatePath } from 'next/cache'
import type { Deck, Card, DeckFormData, CardFormData } from '@/src/types/domain'

// Mock user ID for now - in a real app this would come from auth
const MOCK_USER_ID = 'user-1'

export async function createDeck(data: DeckFormData) {
  try {
    const { data: deck, error } = await supabase
      .from('decks')
      .insert({
        name: data.name,
        description: data.description,
        user_id: MOCK_USER_ID,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/deck')
    return { success: true, data: deck }
  } catch (error) {
    console.error('Error creating deck:', error)
    return { success: false, error: 'Failed to create deck' }
  }
}

export async function getDecks(): Promise<Deck[]> {
  try {
    const { data: decks, error } = await supabase
      .from('decks')
      .select(`
        *,
        cards (*)
      `)
      .eq('user_id', MOCK_USER_ID)
      .order('created_at', { ascending: false })

    if (error) throw error

    return decks.map(deck => ({
      id: deck.id,
      name: deck.name,
      description: deck.description,
      userId: deck.user_id,
      createdAt: deck.created_at,
      updatedAt: deck.updated_at,
      cards: deck.cards.map((card: any) => ({
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
    }))
  } catch (error) {
    console.error('Error fetching decks:', error)
    return []
  }
}

export async function getDeck(id: string): Promise<Deck | null> {
  try {
    const { data: deck, error } = await supabase
      .from('decks')
      .select(`
        *,
        cards (*)
      `)
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)
      .single()

    if (error) throw error

    return {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      userId: deck.user_id,
      createdAt: deck.created_at,
      updatedAt: deck.updated_at,
      cards: deck.cards.map((card: any) => ({
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
    }
  } catch (error) {
    console.error('Error fetching deck:', error)
    return null
  }
}

export async function updateDeck(id: string, data: Partial<DeckFormData>) {
  try {
    const { error } = await supabase
      .from('decks')
      .update({
        name: data.name,
        description: data.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)

    if (error) throw error

    revalidatePath('/deck')
    revalidatePath(`/deck/${id}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating deck:', error)
    return { success: false, error: 'Failed to update deck' }
  }
}

export async function deleteDeck(id: string) {
  try {
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)

    if (error) throw error

    revalidatePath('/deck')
    return { success: true }
  } catch (error) {
    console.error('Error deleting deck:', error)
    return { success: false, error: 'Failed to delete deck' }
  }
}

export async function createCard(data: CardFormData & { deckId?: string }) {
  try {
    const { data: card, error } = await supabase
      .from('cards')
      .insert({
        my_char: data.myChar,
        opp_char: data.oppChar,
        percent_band: data.percentBand,
        situation: data.situation,
        opp_move: data.oppMove,
        answer_md: data.answerMD,
        deck_id: data.deckId,
        user_id: MOCK_USER_ID,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/deck')
    if (data.deckId) {
      revalidatePath(`/deck/${data.deckId}`)
    }
    return { success: true, data: card }
  } catch (error) {
    console.error('Error creating card:', error)
    return { success: false, error: 'Failed to create card' }
  }
}

export async function getCard(id: string): Promise<Card | null> {
  try {
    const { data: card, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)
      .single()

    if (error) throw error

    return {
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
    }
  } catch (error) {
    console.error('Error fetching card:', error)
    return null
  }
}

export async function updateCard(id: string, data: Partial<CardFormData>) {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (data.myChar) updateData.my_char = data.myChar
    if (data.oppChar) updateData.opp_char = data.oppChar
    if (data.percentBand) updateData.percent_band = data.percentBand
    if (data.situation) updateData.situation = data.situation
    if (data.oppMove !== undefined) updateData.opp_move = data.oppMove
    if (data.answerMD) updateData.answer_md = data.answerMD

    const { error } = await supabase
      .from('cards')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)

    if (error) throw error

    revalidatePath('/deck')
    revalidatePath(`/card/${id}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating card:', error)
    return { success: false, error: 'Failed to update card' }
  }
}

export async function deleteCard(id: string) {
  try {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)
      .eq('user_id', MOCK_USER_ID)

    if (error) throw error

    revalidatePath('/deck')
    return { success: true }
  } catch (error) {
    console.error('Error deleting card:', error)
    return { success: false, error: 'Failed to delete card' }
  }
}