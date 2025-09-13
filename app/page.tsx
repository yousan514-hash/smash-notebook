import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Smash Notebook</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link 
          href="/deck"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">デッキ一覧</h2>
          <p className="text-gray-600 dark:text-gray-400">
            作成したデッキを管理・閲覧できます
          </p>
        </Link>

        <Link 
          href="/feed"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">フィード</h2>
          <p className="text-gray-600 dark:text-gray-400">
            みんなの投稿を見る・投稿する
          </p>
        </Link>

        <Link 
          href="/deck/new"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">新規デッキ作成</h2>
          <p className="text-gray-600 dark:text-gray-400">
            新しいデッキを作成します
          </p>
        </Link>
      </div>
    </div>
  )
}