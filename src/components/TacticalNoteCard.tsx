'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, User, Calendar, Tag } from 'lucide-react'
import { TacticalNote } from '@/types'

interface TacticalNoteCardProps {
  note: TacticalNote
  onUpdate?: () => void
}

export function TacticalNoteCard({ note }: TacticalNoteCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(note.likes_count || 0)

  const handleLike = async () => {
    // For demo purposes, we'll just toggle the like state
    // In a real app, you'd check if user is authenticated and handle the like/unlike
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: note.content,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${note.title}\n\n${note.content}\n\n${window.location.href}`)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getCharacterEmoji = (character: string) => {
    // Simple mapping of characters to emojis for visual appeal
    const emojiMap: { [key: string]: string } = {
      'Mario': '🔴',
      'Luigi': '🟢',
      'Pikachu': '⚡',
      'Link': '🗡️',
      'Samus': '🤖',
      'Bowser': '🐲',
      'Peach': '👑',
      'Yoshi': '🦕',
      'Donkey Kong': '🦍',
      'Captain Falcon': '🏎️',
      'Fox': '🦊',
      'Falco': '🦅',
      'Kirby': '⭐',
      'Ness': '🎯',
      'Zelda': '✨',
      'Sheik': '🥷',
      'Ganondorf': '👹',
    }
    return emojiMap[character] || '🎮'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {note.user_avatar ? (
              <Image
                src={note.user_avatar}
                alt={note.user_name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{note.user_name}</p>
            <p className="text-sm text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(note.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-lg">{getCharacterEmoji(note.character)}</span>
          <span className="text-sm font-medium text-gray-700">{note.character}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{note.title}</h3>
        <p className="text-gray-700 text-sm line-clamp-3">{note.content}</p>
      </div>

      {/* Situation */}
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          状況: {note.situation}
        </span>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-sm transition-colors ${
              isLiked 
                ? 'text-red-600 hover:text-red-700' 
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
          
          <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>コメント</span>
          </button>
        </div>
        
        <button
          onClick={handleShare}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>共有</span>
        </button>
      </div>
    </div>
  )
}