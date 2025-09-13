'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PostToCardModal } from './post-to-card-modal'
import { PostWithOwner, PostToCardDraft } from '@/types'
import { FileText } from 'lucide-react'
import { extractPercentBands, extractMoveNames } from '@/lib/utils'

interface PostToCardButtonProps {
  post: PostWithOwner
  className?: string
}

export function PostToCardButton({ post, className }: PostToCardButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    setShowModal(true)
  }

  // 投稿から情報を抽出
  const extractedData = {
    percentBands: extractPercentBands(post.content),
    moveNames: extractMoveNames(post.content),
    content: post.content,
  }

  const draft: PostToCardDraft = {
    postId: post.id,
    deckId: '', // モーダル内で選択
    extractedData,
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className={className}
      >
        <FileText className="h-4 w-4 mr-2" />
        カード化
      </Button>

      {showModal && (
        <PostToCardModal
          draft={draft}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}