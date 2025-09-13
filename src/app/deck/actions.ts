'use server'

import { prisma } from '@/lib/db'
import { PercentBand, Situation } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDeck(formData: FormData) {
  const title = formData.get('title') as string
  
  if (!title) {
    throw new Error('Title is required')
  }

  const deck = await prisma.deck.create({
    data: {
      title,
      ownerId: 'seed-user', // 固定ユーザー
      isPublic: false
    }
  })

  revalidatePath('/deck')
  redirect(`/deck/${deck.id}`)
}

export async function createCard(formData: FormData) {
  const deckId = formData.get('deckId') as string
  const myChar = formData.get('myChar') as string
  const oppChar = formData.get('oppChar') as string
  const percentBand = formData.get('percentBand') as PercentBand
  const situation = formData.get('situation') as Situation
  const oppMove = formData.get('oppMove') as string
  const answerMD = formData.get('answerMD') as string

  if (!deckId || !myChar || !oppChar || !percentBand || !situation || !answerMD) {
    throw new Error('All required fields must be filled')
  }

  await prisma.card.create({
    data: {
      deckId,
      ownerId: 'seed-user', // 固定ユーザー
      myChar,
      oppChar,
      percentBand,
      situation,
      oppMove: oppMove || null,
      answerMD,
      isPublic: false
    }
  })

  revalidatePath(`/deck/${deckId}`)
}

export async function deleteCard(cardId: string) {
  const card = await prisma.card.findUnique({
    where: { id: cardId }
  })
  
  if (!card) {
    throw new Error('Card not found')
  }

  await prisma.card.delete({
    where: { id: cardId }
  })

  revalidatePath(`/deck/${card.deckId}`)
}

export async function deleteDeck(deckId: string) {
  // まずカードを削除
  await prisma.card.deleteMany({
    where: { deckId }
  })
  
  // デッキを削除
  await prisma.deck.delete({
    where: { id: deckId }
  })

  revalidatePath('/deck')
  redirect('/deck')
}