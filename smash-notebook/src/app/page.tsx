import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smash Notebook
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            スマブラの対策ノートをカードゲーム風に整理・共有できるSNSプラットフォーム
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/deck">
              <Button size="lg">デッキを見る</Button>
            </Link>
            <Link href="/deck/create">
              <Button variant="outline" size="lg">デッキを作成</Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              🃏
            </div>
            <h3 className="text-lg font-semibold mb-2">カードゲーム形式</h3>
            <p className="text-gray-600">
              キャラクター・状況・%帯ごとに対策をカード化して整理
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              👥
            </div>
            <h3 className="text-lg font-semibold mb-2">SNS機能</h3>
            <p className="text-gray-600">
              デッキの共有・いいね・フォロー機能でコミュニティと繋がる
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              💬
            </div>
            <h3 className="text-lg font-semibold mb-2">コミュニティ</h3>
            <p className="text-gray-600">
              キャラクター別・研究テーマ別のコミュニティで情報交換
            </p>
          </div>
        </div>

        {/* Popular Decks Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">人気のデッキ</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample deck cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h3 className="font-semibold">サンプルデッキ {i}</h3>
                    <p className="text-sm text-gray-500">vs マリオ対策</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  マリオとの対戦で使える基本的な対策をまとめたデッキです。
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>❤️ 24</span>
                    <span>📝 12カード</span>
                  </div>
                  <Link href={`/deck/${i}`}>
                    <Button variant="outline" size="sm">詳細</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}