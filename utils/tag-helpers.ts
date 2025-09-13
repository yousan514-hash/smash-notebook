import { Situation } from '@/types'

// セクションからタグを自動生成
export function generateSectionTags(situation: Situation): string[] {
  const tags: string[] = [situation]
  
  // 追加の関連タグを生成
  switch (situation) {
    case '立ち回り':
      tags.push('ニュートラル')
      break
    case '崖展開':
      tags.push('崖', 'エッジガード')
      break
    case '撃墜':
      tags.push('バースト', 'キル')
      break
    case '着地狩り':
      tags.push('着地', '対空')
      break
    case '復帰阻止':
      tags.push('復帰', 'オフステージ')
      break
  }
  
  return tags
}

// タグを正規化（小文字化、スペース除去など）
export function normalizeTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_') // スペースをアンダースコアに
    .replace(/[^\p{L}\p{N}_-]/gu, '') // 文字・数字・アンダースコア・ハイフン以外を除去
}

// 重複を除いてタグをマージ
export function mergeTags(existingTags: string[], newTags: string[]): string[] {
  const normalized = new Map<string, string>()
  
  // 既存のタグを正規化して保存
  existingTags.forEach(tag => {
    const normalizedTag = normalizeTag(tag)
    if (normalizedTag && !normalized.has(normalizedTag)) {
      normalized.set(normalizedTag, tag)
    }
  })
  
  // 新しいタグを追加（重複チェック）
  newTags.forEach(tag => {
    const normalizedTag = normalizeTag(tag)
    if (normalizedTag && !normalized.has(normalizedTag)) {
      normalized.set(normalizedTag, tag)
    }
  })
  
  return Array.from(normalized.values())
}