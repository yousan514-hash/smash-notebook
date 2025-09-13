'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'

interface Provider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Smash Notebookにログイン
            </h1>
            <p className="text-gray-600">
              アカウントにログインしてデッキを作成・共有しましょう
            </p>
          </div>

          <div className="space-y-4">
            {providers && Object.values(providers).map((provider: Provider) => (
              <div key={provider.name}>
                <Button
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                  className="w-full flex items-center justify-center space-x-2"
                  size="lg"
                >
                  {provider.name === 'Google' && <span>🔍</span>}
                  <span>{provider.name}でログイン</span>
                </Button>
              </div>
            ))}
            
            {/* Web3 Wallet Connection - Future Implementation */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
              size="lg"
              disabled
            >
              <span>🦊</span>
              <span>MetaMaskで接続（準備中）</span>
            </Button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            ログインすることで、
            <a href="#" className="text-blue-600 hover:underline">利用規約</a>
            および
            <a href="#" className="text-blue-600 hover:underline">プライバシーポリシー</a>
            に同意したものとみなされます。
          </div>
        </div>
      </main>
    </div>
  )
}