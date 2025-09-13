import { FeedPageClient } from './feed-page-client'
import { prisma } from '@/lib/prisma'

async function getPosts() {
  const posts = await prisma.post.findMany({
    where: {
      isPublic: true,
    },
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 20, // 最新20件
  })

  return posts
}

export default async function HomePage() {
  const posts = await getPosts()

  return <FeedPageClient posts={posts} />
}

export const metadata = {
  title: 'スマブラ戦術ノート - フィード',
  description: 'スマブラプレイヤーの戦術投稿を見てみよう',
}