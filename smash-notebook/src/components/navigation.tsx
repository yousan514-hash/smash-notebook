'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from './ui/button'

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Smash Notebook
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/deck" className="text-gray-500 hover:text-gray-700 px-3 py-2">
                デッキ
              </Link>
              <Link href="/feed" className="text-gray-500 hover:text-gray-700 px-3 py-2">
                フィード
              </Link>
              <Link href="/community" className="text-gray-500 hover:text-gray-700 px-3 py-2">
                コミュニティ
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <>
                <Link href="/deck/create">
                  <Button variant="outline">デッキ作成</Button>
                </Link>
                <Link href="/compose">
                  <Button variant="outline">投稿</Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <img
                    src={session.user?.image || '/default-avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-700">{session.user?.name}</span>
                </div>
                <Button variant="ghost" onClick={() => signOut()}>
                  ログアウト
                </Button>
              </>
            ) : (
              <Button onClick={() => signIn('google')}>
                ログイン
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}