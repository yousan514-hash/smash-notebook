'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { characters, templateCards } from '@/lib/characters'
import { createDeck } from '../actions'

export default function NewDeckPage() {
  const [selectedChar, setSelectedChar] = useState<number | null>(null)
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [deckTitle, setDeckTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const sections = [
    "立ち回り",
    "崖展開", 
    "崖狩り",
    "復帰阻止",
    "ライン回復",
    "崖上がり",
    "復帰"
  ]

  const handleCreateDeck = async () => {
    if (!selectedChar || !deckTitle) {
      alert('キャラクターとデッキ名を選択してください')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      const selectedCharName = characters.find(c => c.id === selectedChar)?.name || ''
      const title = selectedChar === 0 ? deckTitle : `${selectedCharName}対策 - ${deckTitle}`
      formData.append('title', title)
      
      await createDeck(formData)
      // createDeck内でリダイレクトされるため、ここでは何もしない
    } catch (error) {
      console.error('Failed to create deck:', error)
      alert('デッキの作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const selectedCharacter = selectedChar !== null ? characters.find(c => c.id === selectedChar) : null

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">新しいデッキを作成</h1>
        <Link href="/deck" className="text-blue-600 hover:underline">
          ← デッキ一覧
        </Link>
      </div>

      <div className="space-y-6">
        {/* デッキ名入力 */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">デッキ名</h2>
          <input
            type="text"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            placeholder="例: 基本対策"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* キャラクター選択 */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-3">対策キャラクター選択</h2>
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedChar(char.id)}
                className={`p-2 text-xs border rounded-md transition-colors ${
                  selectedChar === char.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {char.name}
              </button>
            ))}
          </div>
          {selectedCharacter && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                選択中: <strong>{selectedCharacter.name}</strong>
              </p>
            </div>
          )}
        </div>

        {/* テンプレセクション選択（00テンプレの場合のみ） */}
        {selectedChar === 0 && (
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-3">テンプレートセクション選択</h2>
            <p className="text-sm text-gray-600 mb-3">
              デッキ作成時に追加するテンプレートカードのセクションを選択してください
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sections.map((section) => (
                <label key={section} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSections([...selectedSections, section])
                      } else {
                        setSelectedSections(selectedSections.filter(s => s !== section))
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{section}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 作成ボタン */}
        <div className="bg-white p-4 rounded-lg border">
          <button
            onClick={handleCreateDeck}
            disabled={loading || !selectedChar || !deckTitle}
            className={`w-full py-3 px-4 rounded-md font-medium ${
              loading || !selectedChar || !deckTitle
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? '作成中...' : 'デッキを作成'}
          </button>
        </div>

        {/* プレビュー */}
        {selectedCharacter && deckTitle && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">作成予定のデッキ:</h3>
            <p className="text-gray-700">
              {selectedChar === 0 ? deckTitle : `${selectedCharacter.name}対策 - ${deckTitle}`}
            </p>
            {selectedChar === 0 && selectedSections.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                テンプレート: {selectedSections.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}