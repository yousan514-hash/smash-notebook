'use client'

import { useState, useEffect } from 'react'
import { createDeck } from './actions'
import Link from 'next/link'

interface Deck {
  id: string
  title: string
  createdAt: string
  _count: { cards: number }
}

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/decks')
      .then(res => res.json())
      .then(data => {
        setDecks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load decks:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">デッキ一覧</h1>
        <div className="flex gap-3">
          <Link 
            href="/deck/new" 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            新規作成
          </Link>
          <Link href="/" className="text-blue-600 hover:underline">
            ← ホームに戻る
          </Link>
        </div>
      </div>

      {/* 新規作成フォーム */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">新しいデッキを作成</h2>
        <form action={createDeck} className="flex gap-3">
          <input
            type="text"
            name="title"
            placeholder="デッキ名を入力..."
            className="flex-1 px-3 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            作成
          </button>
        </form>
      </div>

      {/* デッキ一覧 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => (
          <Link
            key={deck.id}
            href={`/deck/${deck.id}`}
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2">{deck.title}</h3>
            <p className="text-gray-600 text-sm">
              {deck._count.cards} カード
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {new Date(deck.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </Link>
        ))}
      </div>

      {decks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>まだデッキがありません。</p>
          <p>上のフォームから新しいデッキを作成してみましょう。</p>
        </div>
      )}
    </div>
  )
}