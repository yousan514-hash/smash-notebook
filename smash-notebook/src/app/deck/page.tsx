import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'

// Sample data - replace with real data from database
const sampleDecks = [
  {
    id: '1',
    title: 'マリオ vs フォックス対策',
    description: 'フォックスとの対戦で使える基本的な対策をまとめました',
    myCharacter: '01',
    characterName: 'マリオ',
    user: { name: 'プレイヤー1', image: '/default-avatar.png' },
    likes: 24,
    cardCount: 12,
    tags: ['立ち回り', '復帰阻止'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2', 
    title: 'ピカチュウ基本セットアップ',
    description: 'ピカチュウの基本的な立ち回りとコンボをまとめたデッキ',
    myCharacter: '09',
    characterName: 'ピカチュウ',
    user: { name: 'プレイヤー2', image: '/default-avatar.png' },
    likes: 18,
    cardCount: 8,
    tags: ['コンボ', '立ち回り'],
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'クラウド崖狩り特化',
    description: '崖狩りに特化したクラウドの戦術集',
    myCharacter: '65',
    characterName: 'クラウド',
    user: { name: 'プレイヤー3', image: '/default-avatar.png' },
    likes: 31,
    cardCount: 15,
    tags: ['崖狩り', '崖展開'],
    createdAt: new Date('2024-01-05'),
  },
]

export default function DeckListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">デッキ一覧</h1>
            <p className="text-gray-600 mt-2">コミュニティで共有されているデッキを探す</p>
          </div>
          <Link href="/deck/create">
            <Button>新しいデッキを作成</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                キャラクター
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">すべて</option>
                <option value="01">マリオ</option>
                <option value="09">ピカチュウ</option>
                <option value="65">クラウド</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                セクション
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">すべて</option>
                <option value="立ち回り">立ち回り</option>
                <option value="崖展開">崖展開</option>
                <option value="崖狩り">崖狩り</option>
                <option value="復帰阻止">復帰阻止</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                並び順
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="popular">人気順</option>
                <option value="recent">新着順</option>
                <option value="most-used">使用数順</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deck Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleDecks.map((deck) => (
            <div key={deck.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                    {deck.characterName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{deck.title}</h3>
                    <p className="text-sm text-gray-500">{deck.characterName}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {deck.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {deck.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>❤️ {deck.likes}</span>
                    <span>📝 {deck.cardCount}カード</span>
                  </div>
                  <span>{deck.createdAt.toLocaleDateString('ja-JP')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={deck.user.image}
                      alt={deck.user.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-600">{deck.user.name}</span>
                  </div>
                  <Link href={`/deck/${deck.id}`}>
                    <Button variant="outline" size="sm">詳細</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline">もっと見る</Button>
        </div>
      </main>
    </div>
  )
}