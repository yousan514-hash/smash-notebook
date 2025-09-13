'use client'

import { useState } from 'react'
import { X, Tag, Plus } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface CreateNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  characters: string[]
}

export function CreateNoteModal({ isOpen, onClose, onSuccess, characters }: CreateNoteModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    character: '',
    situation: '',
    tags: [] as string[],
    isPublic: true
  })
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const situations = [
    'ニュートラル',
    '復帰阻止',
    'エッジガード',
    '着地狩り',
    'コンボ',
    '撃墜',
    '復帰',
    'ガード解除',
    '崖上がり',
    '技後の確定',
    'ダメージレース',
    '立ち回り',
    'その他'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!isSupabaseConfigured) {
        // In demo mode, just simulate success
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('デモモードでは実際には保存されません。Supabaseを設定すると実際に保存できます。')
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          character: '',
          situation: '',
          tags: [],
          isPublic: true
        })
        onSuccess()
        onClose()
        return
      }

      // For demo purposes, we'll create a mock user ID
      // In a real app, you'd get this from authentication
      const mockUserId = '00000000-0000-0000-0000-000000000000'

      const { error } = await supabase
        .from('tactical_notes')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            character: formData.character,
            situation: formData.situation,
            tags: formData.tags,
            user_id: mockUserId,
            is_public: formData.isPublic
          }
        ])

      if (error) {
        console.error('Error creating note:', error)
        alert('戦術ノートの作成に失敗しました。データベースの設定を確認してください。')
      } else {
        // Reset form
        setFormData({
          title: '',
          content: '',
          character: '',
          situation: '',
          tags: [],
          isPublic: true
        })
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('戦術ノートの作成に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">新しい戦術ノート</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              タイトル *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="戦術ノートのタイトルを入力..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Character and Situation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="character" className="block text-sm font-medium text-gray-700 mb-2">
                キャラクター *
              </label>
              <select
                id="character"
                name="character"
                required
                value={formData.character}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">キャラクターを選択</option>
                {characters.map(character => (
                  <option key={character} value={character}>{character}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="situation" className="block text-sm font-medium text-gray-700 mb-2">
                状況 *
              </label>
              <select
                id="situation"
                name="situation"
                required
                value={formData.situation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">状況を選択</option>
                {situations.map(situation => (
                  <option key={situation} value={situation}>{situation}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              内容 *
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={6}
              value={formData.content}
              onChange={handleInputChange}
              placeholder="戦術の詳細を入力してください..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="タグを追加..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Public/Private */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                公開する（他のユーザーが閲覧できます）
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '作成中...' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}