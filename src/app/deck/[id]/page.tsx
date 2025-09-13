'use client'

import { useState, useEffect } from 'react'
import { createCard, deleteCard, deleteDeck } from '../actions'
import { percentBandToLabel, situationToLabel, PercentBand, Situation } from '@/lib/types'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

interface Card {
  id: string
  myChar: string
  oppChar: string
  percentBand: PercentBand
  situation: Situation
  oppMove: string | null
  answerMD: string
  createdAt: string
}

interface Deck {
  id: string
  title: string
  cards: Card[]
}

export default function DeckDetailPage() {
  const [deck, setDeck] = useState<Deck | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  useEffect(() => {
    if (!id) return
    
    fetch(`/api/decks/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Deck not found')
        return res.json()
      })
      .then(data => {
        setDeck(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load deck:', err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">読み込み中...</div>
      </div>
    )
  }

  if (!deck) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">デッキが見つかりません</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{deck.title}</h1>
          <p className="text-gray-600">{deck.cards.length} カード</p>
        </div>
        <div className="flex gap-3">
          <Link href="/deck" className="text-blue-600 hover:underline">
            ← デッキ一覧
          </Link>
          <form action={deleteDeck.bind(null, deck.id)} className="inline">
            <button
              type="submit"
              className="text-red-600 hover:underline"
              onClick={(e) => {
                if (!confirm('このデッキを削除しますか？')) {
                  e.preventDefault()
                }
              }}
            >
              削除
            </button>
          </form>
        </div>
      </div>

      {/* 新規カード作成フォーム */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">新しいカードを追加</h2>
        <form action={createCard} className="space-y-3">
          <input type="hidden" name="deckId" value={deck.id} />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">使用キャラ</label>
              <input
                type="text"
                name="myChar"
                placeholder="クラウド"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">相手キャラ</label>
              <input
                type="text"
                name="oppChar"
                placeholder="ジョーカー"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">%帯</label>
              <select name="percentBand" className="w-full px-3 py-2 border rounded-md" required>
                <option value="">選択してください</option>
                <option value="PERCENT_0_30">0-30%</option>
                <option value="PERCENT_40_70">40-70%</option>
                <option value="PERCENT_80_PLUS">80%+</option>
                <option value="KILL">Kill%</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">状況</label>
              <select name="situation" className="w-full px-3 py-2 border rounded-md" required>
                <option value="">選択してください</option>
                <option value="neutral">立ち回り</option>
                <option value="ledgetrap">崖展開</option>
                <option value="edgeguard">崖狩り</option>
                <option value="recovery">復帰阻止</option>
                <option value="combo">ライン回復</option>
                <option value="line">崖上がり</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">相手の技 (任意)</label>
            <input
              type="text"
              name="oppMove"
              placeholder="空N"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">対策・メモ</label>
            <textarea
              name="answerMD"
              rows={3}
              placeholder="**方針**: ガード後は最速上B or 後退ガード→下強"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            カードを追加
          </button>
        </form>
      </div>

      {/* カード一覧 */}
      <div className="grid gap-4">
        {deck.cards.map((card) => (
          <div key={card.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3 text-sm">
                <span className="bg-blue-100 px-2 py-1 rounded">
                  {card.myChar} vs {card.oppChar}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {percentBandToLabel(card.percentBand)}
                </span>
                <span className="bg-green-100 px-2 py-1 rounded">
                  {situationToLabel(card.situation)}
                </span>
                {card.oppMove && (
                  <span className="bg-orange-100 px-2 py-1 rounded">
                    {card.oppMove}
                  </span>
                )}
              </div>
              <form action={deleteCard.bind(null, card.id)} className="inline">
                <button
                  type="submit"
                  className="text-red-600 hover:underline text-sm"
                  onClick={(e) => {
                    if (!confirm('このカードを削除しますか？')) {
                      e.preventDefault()
                    }
                  }}
                >
                  削除
                </button>
              </form>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{card.answerMD}</div>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              {new Date(card.createdAt).toLocaleString('ja-JP')}
            </div>
          </div>
        ))}
      </div>

      {deck.cards.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>まだカードがありません。</p>
          <p>上のフォームから新しいカードを作成してみましょう。</p>
        </div>
      )}
    </div>
  )
}