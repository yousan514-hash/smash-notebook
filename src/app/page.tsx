'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { TacticalNote } from '@/types'
import { TacticalNoteCard } from '@/components/TacticalNoteCard'
import { CreateNoteModal } from '@/components/CreateNoteModal'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function Home() {
  const [notes, setNotes] = useState<TacticalNote[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [loading, setLoading] = useState(true)

  const smashCharacters = [
    'Mario', 'Donkey Kong', 'Link', 'Samus', 'Yoshi', 'Kirby', 'Fox', 'Pikachu',
    'Luigi', 'Ness', 'Captain Falcon', 'Jigglypuff', 'Peach', 'Bowser', 'Ice Climbers',
    'Sheik', 'Zelda', 'Dr. Mario', 'Pichu', 'Falco', 'Marth', 'Lucina', 'Young Link',
    'Ganondorf', 'Mewtwo', 'Roy', 'Chrom', 'Mr. Game & Watch', 'Meta Knight', 'Pit',
    'Dark Pit', 'Zero Suit Samus', 'Wario', 'Snake', 'Ike', 'Pokemon Trainer',
    'Diddy Kong', 'Lucas', 'Sonic', 'King Dedede', 'Olimar', 'Lucario', 'R.O.B.',
    'Toon Link', 'Wolf', 'Villager', 'Mega Man', 'Wii Fit Trainer', 'Rosalina & Luma',
    'Little Mac', 'Greninja', 'Mii Brawler', 'Mii Swordfighter', 'Mii Gunner',
    'Palutena', 'Pac-Man', 'Robin', 'Shulk', 'Bowser Jr.', 'Duck Hunt', 'Ryu',
    'Ken', 'Cloud', 'Corrin', 'Bayonetta', 'Inkling', 'Ridley', 'Simon', 'Richter',
    'King K. Rool', 'Isabelle', 'Incineroar', 'Piranha Plant', 'Joker', 'Hero',
    'Banjo & Kazooie', 'Terry', 'Byleth', 'Min Min', 'Steve', 'Sephiroth', 'Pyra/Mythra',
    'Kazuya', 'Sora'
  ]

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Use mock data when Supabase is not configured
        const mockNotes: TacticalNote[] = [
          {
            id: '1',
            title: 'ピカチュウの雷撃墜セットアップ',
            content: '相手が高%の時に上強→雷で確実に撃墜できるセットアップ。タイミングが重要で、相手の回避行動を読む必要がある。',
            character: 'Pikachu',
            situation: '撃墜',
            tags: ['撃墜', 'コンボ', '確定'],
            user_id: 'demo-user',
            user_name: 'でんきねずみ',
            user_avatar: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            likes_count: 12,
            is_public: true
          },
          {
            id: '2',
            title: 'マリオの0死コンボ',
            content: '低%での掴み→上投げ→上強×数回→上スマ。DI読みが重要で、相手の重さとダメージによって調整が必要。',
            character: 'Mario',
            situation: 'コンボ',
            tags: ['0死', 'コンボ', '掴み'],
            user_id: 'demo-user2',
            user_name: 'マリオ使い',
            user_avatar: '',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            likes_count: 8,
            is_public: true
          },
          {
            id: '3',
            title: 'フォックスの復帰阻止テクニック',
            content: 'ファイアフォックスを見てからシャインメテオで復帰阻止。角度と距離の調整がキモ。',
            character: 'Fox',
            situation: '復帰阻止',
            tags: ['復帰阻止', 'メテオ', 'シャイン'],
            user_id: 'demo-user3',
            user_name: 'きつね',
            user_avatar: '',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString(),
            likes_count: 15,
            is_public: true
          }
        ]
        setNotes(mockNotes)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('notes_with_stats')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notes:', error)
      } else {
        setNotes(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCharacter = !selectedCharacter || note.character === selectedCharacter
    return matchesSearch && matchesCharacter
  })

  const handleCreateNote = () => {
    fetchNotes() // Refresh notes after creating
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tactical notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Smash Notebook</h1>
              <span className="ml-2 text-sm text-gray-500">戦術ノート</span>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新しいノート
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Configuration Warning */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>デモモード:</strong> Supabaseが設定されていないため、サンプルデータを表示しています。
                  実際の機能を使用するには、<code className="bg-yellow-100 px-1 rounded">.env.local</code>ファイルに
                  Supabaseの設定を追加してください。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="戦術を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">全キャラクター</option>
                {smashCharacters.map(character => (
                  <option key={character} value={character}>{character}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCharacter ? '該当する戦術ノートが見つかりません' : '戦術ノートがまだありません'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCharacter ? '検索条件を変更してみてください' : '最初の戦術ノートを作成しましょう！'}
            </p>
            {!searchTerm && !selectedCharacter && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                戦術ノートを作成
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <TacticalNoteCard
                key={note.id}
                note={note}
                onUpdate={fetchNotes}
              />
            ))}
          </div>
        )}
      </main>

      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateNote}
        characters={smashCharacters}
      />
    </div>
  )
}
