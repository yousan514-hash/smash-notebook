import { DeckNewPageClient } from './deck-new-page-client'
import { prisma } from '@/lib/prisma'

async function getTemplates() {
  // TODO: ユーザー認証後は、そのユーザーのテンプレートのみ取得
  const templates = await prisma.template.findMany({
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return templates
}

export default async function DeckNewPage() {
  const templates = await getTemplates()

  return <DeckNewPageClient templates={templates} />
}

export const metadata = {
  title: '新しいデッキを作成 - スマブラ戦術ノート',
  description: 'スマブラの戦術デッキを新規作成します',
}