import { PercentBand } from '@/types'

interface ExtractedCardInfo {
  percentBand?: PercentBand
  moves: string[]
}

// 投稿内容から%帯と技名を抽出
export function extractCardInfo(content: string): ExtractedCardInfo {
  const info: ExtractedCardInfo = {
    moves: [],
  }

  // %帯の抽出
  const percentPatterns = [
    { pattern: /(?:^|\s)00%?(?:\s|$)/i, value: '00' as PercentBand },
    { pattern: /(?:^|\s)50%?(?:\s|$)/i, value: '50' as PercentBand },
    { pattern: /(?:^|\s)80%?(?:\s|$)/i, value: '80' as PercentBand },
    { pattern: /(?:^|\s)(?:kill|キル)%?(?:\s|$)/i, value: 'Kill' as PercentBand },
  ]

  for (const { pattern, value } of percentPatterns) {
    if (pattern.test(content)) {
      info.percentBand = value
      break
    }
  }

  // 技名の抽出
  const movePatterns = [
    // 空中攻撃
    /空[NnＮ]|空前|空後|空上|空下|空中[NnＮ]|空中ニュートラル/g,
    // 地上攻撃
    /横強|上強|下強|弱[1-3]?|DA|ダッシュ攻撃|横スマ|上スマ|下スマ/g,
    // 必殺技
    /[NnＮ][BbＢ]|横[BbＢ]|上[BbＢ]|下[BbＢ]|NB|横B|上B|下B/g,
    // その他
    /掴み|投げ|ガーキャン|ガーキャン上[BbＢ]|ガーキャン上スマ/g,
    // 英語表記
    /[nN]air|[fF]air|[bB]air|[uU]air|[dD]air|[fF]tilt|[uU]tilt|[dD]tilt/g,
    /[fF]smash|[uU]smash|[dD]smash|[jJ]ab/g,
  ]

  const foundMoves = new Set<string>()
  for (const pattern of movePatterns) {
    const matches = content.match(pattern)
    if (matches) {
      matches.forEach(move => foundMoves.add(move))
    }
  }

  info.moves = Array.from(foundMoves)

  return info
}

// カード草稿用のテキストを生成
export function generateCardDraft(content: string, cardInfo: ExtractedCardInfo): string {
  let draft = content

  // 既に抽出された情報を強調表示
  if (cardInfo.percentBand) {
    draft = `【${cardInfo.percentBand}%帯】\n${draft}`
  }

  if (cardInfo.moves.length > 0) {
    draft = `${draft}\n\n関連技: ${cardInfo.moves.join(', ')}`
  }

  return draft
}