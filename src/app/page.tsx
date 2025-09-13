'use client'

import { useState, useEffect } from 'react'
import Link from "next/link";

interface Post {
  id: string
  body: string
  author: {
    displayName: string
    handle: string | null
  }
  linkedCard?: {
    id: string
    myChar: string
    oppChar: string
    percentBand: string
    situation: string
  } | null
  createdAt: string
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load posts:', err)
        setLoading(false)
      })
  }, [])

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    setPosting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newPost })
      })
      
      if (response.ok) {
        const newPostData = await response.json()
        setPosts([newPostData, ...posts])
        setNewPost('')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('投稿に失敗しました')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Smash Notebook</h1>
        <div className="flex gap-3">
          <Link 
            href="/deck" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            デッキ管理
          </Link>
          <Link href="/api/health" className="text-gray-600 hover:underline text-sm">
            Health Check
          </Link>
        </div>
      </div>

      {/* 投稿作成フォーム */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h2 className="text-lg font-semibold mb-3">新しい投稿</h2>
        <form onSubmit={handleSubmitPost} className="space-y-3">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="戦術について共有しましょう..."
            className="w-full px-3 py-2 border rounded-md h-20"
            disabled={posting}
          />
          <button
            type="submit"
            disabled={posting || !newPost.trim()}
            className={`px-4 py-2 rounded-md font-medium ${
              posting || !newPost.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {posting ? '投稿中...' : '投稿する'}
          </button>
        </form>
      </div>

      {/* 投稿一覧 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">最新の投稿</h2>
        
        {loading ? (
          <div className="text-center py-12">読み込み中...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>まだ投稿がありません。</p>
            <p>最初の投稿をしてみましょう！</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{post.author.displayName}</span>
                  {post.author.handle && (
                    <span className="text-gray-500 text-sm">@{post.author.handle}</span>
                  )}
                </div>
                <span className="text-gray-500 text-xs">
                  {new Date(post.createdAt).toLocaleString('ja-JP')}
                </span>
              </div>
              
              <div className="whitespace-pre-wrap mb-3">{post.body}</div>
              
              {post.linkedCard && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex gap-2 text-sm">
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      {post.linkedCard.myChar} vs {post.linkedCard.oppChar}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {post.linkedCard.percentBand}
                    </span>
                    <span className="bg-green-100 px-2 py-1 rounded">
                      {post.linkedCard.situation}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}