'use client'

import { Plus, FileText, Home, User } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MobileActionBar() {
  const router = useRouter()
  const pathname = usePathname()

  const actions = [
    {
      icon: Home,
      label: 'ホーム',
      href: '/',
      active: pathname === '/',
    },
    {
      icon: Plus,
      label: '新規投稿',
      href: '/posts/new',
      action: true,
    },
    {
      icon: FileText,
      label: '新規カード',
      href: '/cards/new',
      action: true,
    },
    {
      icon: User,
      label: 'プロフィール',
      href: '/profile',
      active: pathname.startsWith('/profile'),
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {actions.map((action) => {
          const Icon = action.icon
          const isActive = action.active
          const isActionButton = action.action

          return (
            <Button
              key={action.href}
              variant={isActionButton ? 'default' : isActive ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'flex flex-col items-center gap-1 h-auto py-2 px-3 min-h-[44px] min-w-[44px]',
                isActionButton && 'bg-primary text-primary-foreground'
              )}
              onClick={() => router.push(action.href)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          )
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  )
}

// ページ全体のレイアウトでモバイルアクションバーのスペースを確保するためのコンポーネント
export function MobileActionBarSpacer() {
  return <div className="h-20 md:hidden" />
}