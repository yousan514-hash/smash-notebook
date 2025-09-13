'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { CHARACTERS, SECTIONS } from '@/lib/characters'

export default function CreateDeckPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    myCharacter: '',
    isPublic: true,
    tags: [] as string[],
  })
  
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement deck creation
    console.log('Creating deck:', formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">新しいデッキを作成</h1>
          <p className="text-gray-600 mt-2">対策ノートをカード形式で整理しましょう</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">基本情報</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  デッキ名 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: マリオ vs フォックス対策"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  説明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="このデッキの目的や使い方を説明してください"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  使用キャラクター *
                </label>
                <select
                  required
                  value={formData.myCharacter}
                  onChange={(e) => setFormData(prev => ({ ...prev, myCharacter: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">キャラクターを選択</option>
                  {CHARACTERS.filter(char => char.id !== '00').map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.nameJa} ({char.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">タグ</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="タグを入力してEnterキーを押す"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  追加
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                推奨タグ: {SECTIONS.join(', ')}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">公開設定</h2>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={formData.isPublic}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">パブリック</div>
                  <div className="text-sm text-gray-500">誰でも閲覧・使用できます</div>
                </div>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  checked={!formData.isPublic}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">プライベート</div>
                  <div className="text-sm text-gray-500">自分だけが閲覧できます</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              キャンセル
            </Button>
            <Button type="submit">
              デッキを作成
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}