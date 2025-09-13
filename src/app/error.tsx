'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">エラーが発生しました</h1>
          <p className="text-muted-foreground">
            申し訳ございません。予期しないエラーが発生しました。
            もう一度お試しください。
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            <RefreshCcw className="mr-2 h-4 w-4" />
            再試行
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            ホームに戻る
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              エラー詳細（開発用）
            </summary>
            <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
              {error.message}
              {error.stack && '\n\n' + error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}