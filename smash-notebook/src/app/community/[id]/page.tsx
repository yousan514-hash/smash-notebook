'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'

// Sample data - replace with real data from database
const sampleCommunity = {
  id: '1',
  name: 'マリオ研究会',
  description: 'マリオ使いのための情報交換コミュニティ。新技の開発やマッチアップ対策を共有しています。詳細なフレームデータの解析から実戦での活用方法まで、幅広く議論しています。',
  character: '01',
  characterName: 'マリオ',
  imageUrl: null,
  isPublic: true,
  memberCount: 245,
  tags: ['マリオ', 'コンボ', '対策'],
  createdAt: new Date('2023-12-01'),
  rules: [
    '建設的な議論を心がけましょう',
    'スパム行為は禁止です',
    '他のプレイヤーを尊重しましょう',
    'ネタバレは適切なタグを付けてください'
  ]
}

const sampleMessages = [
  {
    id: '1',
    content: 'マリオの上強→空上のコンボ、%帯によって繋がり方が変わりますよね。詳しい%帯知ってる人いますか？',
    user: {
      id: '1',
      name: 'マリオマスター',
      image: '/default-avatar.png'
    },
    createdAt: new Date('2024-01-20T14:30:00'),
  },
  {
    id: '2',
    content: '大体0-40%くらいまでは確定で繋がって、40-70%は相手のベクトル変更次第ですね。キャラによっても違いますが',
    user: {
      id: '2',
      name: 'プレイヤー2',
      image: '/default-avatar.png'
    },
    createdAt: new Date('2024-01-20T14:32:00'),
  },
  {
    id: '3',
    content: 'ありがとうございます！軽量級と重量級でも違いそうですね',
    user: {
      id: '1',
      name: 'マリオマスター',
      image: '/default-avatar.png'
    },
    createdAt: new Date('2024-01-20T14:33:00'),
  },
  {
    id: '4',
    content: '今度フレームデータまとめて投稿しますね。キャラ別の詳細データ取れてます',
    user: {
      id: '3',
      name: 'データ解析者',
      image: '/default-avatar.png'
    },
    createdAt: new Date('2024-01-20T14:35:00'),
  },
]

interface CommunityDetailPageProps {
  params: {
    id: string
  }
}

export default function CommunityDetailPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'info'>('chat')
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState(sampleMessages)

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        content: messageInput.trim(),
        user: {
          id: 'current-user',
          name: 'あなた',
          image: '/default-avatar.png'
        },
        createdAt: new Date(),
      }
      setMessages([...messages, newMessage])
      setMessageInput('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Community Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                {sampleCommunity.characterName?.charAt(0) || '🌟'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{sampleCommunity.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <span>👥 {sampleCommunity.memberCount}人</span>
                  <span className="mx-2">•</span>
                  <span>{sampleCommunity.isPublic ? '🌍 パブリック' : '🔒 プライベート'}</span>
                  {sampleCommunity.characterName && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{sampleCommunity.characterName}コミュニティ</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">招待</Button>
              <Button>参加中</Button>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{sampleCommunity.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {sampleCommunity.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-4">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'chat'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  💬 チャット
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'members'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  👥 メンバー
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'info'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ℹ️ 情報
                </button>
              </div>
            </div>

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <img
                        src={message.user.image}
                        alt={message.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{message.user.name}</span>
                          <span className="text-xs text-gray-500">
                            {message.createdAt.toLocaleTimeString('ja-JP', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-800 text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="メッセージを入力..."
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button onClick={sendMessage}>送信</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">メンバー一覧</h3>
                <div className="space-y-3">
                  {['マリオマスター', 'プレイヤー2', 'データ解析者', 'コンボ研究者'].map((name, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src="/default-avatar.png"
                          alt={name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-sm text-gray-500">
                            {index === 0 ? '管理者' : 'メンバー'}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">プロフィール</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">コミュニティルール</h3>
                    <ul className="space-y-2">
                      {sampleCommunity.rules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">{index + 1}.</span>
                          <span className="text-gray-700">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">統計</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{sampleCommunity.memberCount}</div>
                        <div className="text-sm text-gray-600">メンバー数</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{messages.length}</div>
                        <div className="text-sm text-gray-600">メッセージ数</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">クイックアクション</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  📋 デッキを共有
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📊 投票を作成
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📅 イベントを企画
                </Button>
              </div>
            </div>

            {/* Related Communities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4">関連コミュニティ</h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-sm">ルイージ研究会</div>
                  <div className="text-xs text-gray-500">156人</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-sm">コンボ開発室</div>
                  <div className="text-xs text-gray-500">89人</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}