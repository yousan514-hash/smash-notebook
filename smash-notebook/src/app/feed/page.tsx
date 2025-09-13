import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'

// Sample data - replace with real data from database
const samplePosts = [
  {
    id: '1',
    content: 'マリオ vs フォックス対策デッキを更新しました！新しく復帰阻止のカードを追加。フォックスの復帰パターンに対する対策をより詳しくまとめています。',
    imageUrl: null,
    videoUrl: null,
    user: {
      id: '1',
      name: 'プレイヤー1',
      image: '/default-avatar.png'
    },
    deck: {
      id: '1',
      title: 'マリオ vs フォックス対策'
    },
    tags: ['マリオ', '対策', 'フォックス'],
    likes: 12,
    comments: 3,
    createdAt: new Date('2024-01-20T10:30:00'),
  },
  {
    id: '2',
    content: '今日のVIP戦でピカチュウと当たったんですが、雷パターンが全然読めませんでした😅 誰かピカチュウ対策のコツ教えてください！',
    imageUrl: null,
    videoUrl: null,
    user: {
      id: '2',
      name: 'プレイヤー2',
      image: '/default-avatar.png'
    },
    deck: null,
    tags: ['質問', 'ピカチュウ', 'VIP'],
    likes: 8,
    comments: 7,
    createdAt: new Date('2024-01-20T09:15:00'),
  },
  {
    id: '3',
    content: '崖狩り特化デッキを作ってみました。主にクラウドで使っていますが、他のキャラでも応用できそうです。',
    imageUrl: null,
    videoUrl: null,
    user: {
      id: '3',
      name: 'プレイヤー3',
      image: '/default-avatar.png'
    },
    deck: {
      id: '3',
      title: 'クラウド崖狩り特化'
    },
    tags: ['クラウド', '崖狩り', 'デッキ'],
    likes: 15,
    comments: 2,
    createdAt: new Date('2024-01-20T08:45:00'),
  },
]

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">フィード</h1>
            <p className="text-gray-600 mt-2">コミュニティの最新投稿</p>
          </div>
          <Link href="/compose">
            <Button>新しい投稿</Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="flex border-b">
            <button className="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
              すべて
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              フォロー中
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              デッキ投稿
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              質問
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {samplePosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
              {/* Post Header */}
              <div className="flex items-center mb-4">
                <img
                  src={post.user.image}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                    <span className="text-gray-500 text-sm ml-2">
                      {post.createdAt.toLocaleString('ja-JP')}
                    </span>
                  </div>
                  {post.deck && (
                    <Link 
                      href={`/deck/${post.deck.id}`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      📝 {post.deck.title}
                    </Link>
                  )}
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  ⋯
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Post Media */}
              {post.imageUrl && (
                <div className="mb-4">
                  <img 
                    src={post.imageUrl} 
                    alt="投稿画像" 
                    className="rounded-lg max-w-full h-auto"
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-6">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-red-600">
                    <span>❤️</span>
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
                    <span>💬</span>
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600">
                    <span>🔄</span>
                    <span>シェア</span>
                  </button>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  🔖
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">もっと読み込む</Button>
        </div>
      </main>
    </div>
  )
}