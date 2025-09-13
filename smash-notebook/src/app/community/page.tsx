import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'

// Sample data - replace with real data from database
const sampleCommunities = [
  {
    id: '1',
    name: 'マリオ研究会',
    description: 'マリオ使いのための情報交換コミュニティ。新技の開発やマッチアップ対策を共有しています。',
    character: '01',
    characterName: 'マリオ',
    imageUrl: null,
    isPublic: true,
    memberCount: 245,
    messageCount: 1203,
    tags: ['マリオ', 'コンボ', '対策'],
    createdAt: new Date('2023-12-01'),
  },
  {
    id: '2',
    name: 'VIP到達サポート',
    description: 'VIP到達を目指すプレイヤー同士で情報交換。メンタル面のサポートも行っています。',
    character: null,
    characterName: null,
    imageUrl: null,
    isPublic: true,
    memberCount: 892,
    messageCount: 5641,
    tags: ['VIP', 'サポート', '初心者'],
    createdAt: new Date('2023-11-15'),
  },
  {
    id: '3',
    name: '崖狩り研究所',
    description: '崖狩りテクニックの研究と共有。キャラクター別の最適解を探求しています。',
    character: null,
    characterName: null,
    imageUrl: null,
    isPublic: true,
    memberCount: 156,
    messageCount: 789,
    tags: ['崖狩り', '研究', 'テクニック'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'ピカチュウ愛好会',
    description: 'ピカチュウ使いのためのコミュニティ。雷の使い方から復帰ルートまで幅広く議論。',
    character: '09',
    characterName: 'ピカチュウ',
    imageUrl: null,
    isPublic: true,
    memberCount: 178,
    messageCount: 934,
    tags: ['ピカチュウ', '雷', '復帰'],
    createdAt: new Date('2023-10-20'),
  },
]

export default function CommunityListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">コミュニティ</h1>
            <p className="text-gray-600 mt-2">同じ目標を持つプレイヤーと繋がろう</p>
          </div>
          <Button>新しいコミュニティを作成</Button>
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4">カテゴリ別に探す</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-medium">キャラクター別</div>
              <div className="text-sm text-gray-500">使用キャラごと</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-medium">研究・技術</div>
              <div className="text-sm text-gray-500">テクニック研究</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-medium">大会・競技</div>
              <div className="text-sm text-gray-500">大会情報・対戦</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="text-2xl mb-2">🆘</div>
              <div className="font-medium">サポート</div>
              <div className="text-sm text-gray-500">初心者支援</div>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="コミュニティを検索..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="p-3 border border-gray-300 rounded-md">
              <option value="">すべて</option>
              <option value="character">キャラクター別</option>
              <option value="research">研究</option>
              <option value="support">サポート</option>
            </select>
            <select className="p-3 border border-gray-300 rounded-md">
              <option value="members">メンバー数順</option>
              <option value="activity">活動順</option>
              <option value="recent">新着順</option>
            </select>
          </div>
        </div>

        {/* Community List */}
        <div className="grid md:grid-cols-2 gap-6">
          {sampleCommunities.map((community) => (
            <div key={community.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                      {community.characterName ? community.characterName.charAt(0) : '🌟'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{community.name}</h3>
                      {community.characterName && (
                        <p className="text-sm text-gray-500">{community.characterName}コミュニティ</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    {community.isPublic ? '🌍' : '🔒'}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {community.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {community.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex space-x-4">
                    <span>👥 {community.memberCount}人</span>
                    <span>💬 {community.messageCount}メッセージ</span>
                  </div>
                  <span>{community.createdAt.toLocaleDateString('ja-JP')}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    作成: {community.createdAt.toLocaleDateString('ja-JP')}
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/community/${community.id}`}>
                      <Button variant="outline" size="sm">詳細</Button>
                    </Link>
                    <Button size="sm">参加</Button>
                  </div>
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