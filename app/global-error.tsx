'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">重大なエラーが発生しました</h2>
            <p className="text-gray-600 mb-6">
              アプリケーションで重大なエラーが発生しました。
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              アプリを再起動
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}