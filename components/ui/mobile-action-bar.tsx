'use client'

import { useState, useEffect } from 'react'

interface MobileActionBarProps {
  onCreateCard?: () => void
  onCreatePost?: () => void
}

export function MobileActionBar({ onCreateCard, onCreatePost }: MobileActionBarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Show when scrolled down and not at bottom
      setIsVisible(scrollTop > 100 && scrollTop < documentHeight - windowHeight - 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <div className="bg-white rounded-full shadow-lg border flex items-center gap-2 px-4 py-2">
        {onCreateCard && (
          <button
            onClick={onCreateCard}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors min-h-[44px]"
            aria-label="新しいカードを作成"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium">カード</span>
          </button>
        )}
        {onCreatePost && (
          <button
            onClick={onCreatePost}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors min-h-[44px]"
            aria-label="新しい投稿を作成"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-sm font-medium">投稿</span>
          </button>
        )}
      </div>
    </div>
  )
}