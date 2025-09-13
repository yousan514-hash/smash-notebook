'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileActionBar() {
  const pathname = usePathname()
  
  // デッキ関連のページかどうかを判定
  const isDeckPage = pathname.startsWith('/deck')
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className="grid grid-cols-2 h-16">
        <Link
          href="/deck/new/card"
          className={cn(
            "tap-target flex items-center justify-center gap-2 text-sm font-medium transition-colors",
            isDeckPage
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          )}
        >
          <Plus className="w-5 h-5" />
          <span>新規カード</span>
        </Link>
        
        <Link
          href="/feed/new"
          className={cn(
            "tap-target flex items-center justify-center gap-2 text-sm font-medium transition-colors",
            pathname.startsWith('/feed')
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          )}
        >
          <FileText className="w-5 h-5" />
          <span>投稿</span>
        </Link>
      </div>
    </div>
  )
}