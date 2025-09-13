'use client'

import { useState } from 'react'
import { trackPostCreated } from '../../lib/analytics'

interface PostToCardExtractorProps {
  content: string
  onExtract: (extractedData: ExtractedData) => void
}

interface ExtractedData {
  percentBands: string[]
  moves: string[]
  characters: string[]
  situations: string[]
}

const PERCENT_PATTERNS = [
  /(\d{2})%/g,
  /(\d{2})パーセント/g,
  /(\d{2})%/g,
  /Kill%/g,
  /キル%/g
]

const MOVE_PATTERNS = [
  /スマッシュ/g,
  /ジャンプ/g,
  /ダッシュ/g,
  /ガード/g,
  /投げ/g,
  /必殺技/g,
  /スペシャル/g,
  /通常技/g,
  /強攻撃/g,
  /弱攻撃/g
]

const CHARACTER_PATTERNS = [
  /マリオ/g,
  /ルイージ/g,
  /ピーチ/g,
  /クッパ/g,
  /ヨッシー/g,
  /ドンキーコング/g,
  /リンク/g,
  /サムス/g,
  /カービィ/g,
  /フォックス/g,
  /ピカチュウ/g,
  /ルカリオ/g,
  /マリナ/g,
  /ゼルダ/g,
  /ガノンドロフ/g,
  /ファルコ/g,
  /メタナイト/g,
  /デデデ/g,
  /アイク/g,
  /ソニック/g,
  /ベヨネッタ/g,
  /インクリング/g,
  /リドリー/g,
  /クロム/g,
  /シモン/g,
  /リヒター/g,
  /キングクルール/g,
  /しずえ/g,
  /ミェンミェン/g,
  /バンジョー&カズーイ/g,
  /テリー/g,
  /ベレト/g,
  /ベレス/g,
  /セフィロス/g,
  /パイラ/g,
  /ミナミヌ/g,
  /スティーブ/g,
  /アレックス/g,
  /エンドマン/g,
  /カズヤ/g,
  /セフィロス/g,
  /パイラ/g,
  /ミナミヌ/g,
  /スティーブ/g,
  /アレックス/g,
  /エンドマン/g,
  /カズヤ/g
]

const SITUATION_PATTERNS = [
  /立ち回り/g,
  /崖展開/g,
  /回復/g,
  /コンボ/g,
  /ガード/g,
  /エッジガード/g,
  /リカバリー/g,
  /ニュートラル/g,
  /オフェンス/g,
  /ディフェンス/g
]

export function PostToCardExtractor({ content, onExtract }: PostToCardExtractorProps) {
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)

  const extractData = () => {
    const percentBands: string[] = []
    const moves: string[] = []
    const characters: string[] = []
    const situations: string[] = []

    // Extract percent bands
    PERCENT_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          const percent = match.replace(/[^\d]/g, '')
          if (percent && !percentBands.includes(percent)) {
            percentBands.push(percent)
          }
        })
      }
    })

    // Extract moves
    MOVE_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          if (!moves.includes(match)) {
            moves.push(match)
          }
        })
      }
    })

    // Extract characters
    CHARACTER_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          if (!characters.includes(match)) {
            characters.push(match)
          }
        })
      }
    })

    // Extract situations
    SITUATION_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        matches.forEach(match => {
          if (!situations.includes(match)) {
            situations.push(match)
          }
        })
      }
    })

    const data: ExtractedData = {
      percentBands,
      moves,
      characters,
      situations
    }

    setExtractedData(data)
    onExtract(data)
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-blue-900">投稿からカード情報を抽出</h4>
        <button
          onClick={extractData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
        >
          抽出実行
        </button>
      </div>

      {extractedData && (
        <div className="space-y-2">
          {extractedData.percentBands.length > 0 && (
            <div>
              <span className="text-sm font-medium text-blue-800">%帯: </span>
              <span className="text-sm text-blue-700">
                {extractedData.percentBands.join(', ')}
              </span>
            </div>
          )}
          {extractedData.moves.length > 0 && (
            <div>
              <span className="text-sm font-medium text-blue-800">技: </span>
              <span className="text-sm text-blue-700">
                {extractedData.moves.join(', ')}
              </span>
            </div>
          )}
          {extractedData.characters.length > 0 && (
            <div>
              <span className="text-sm font-medium text-blue-800">キャラクター: </span>
              <span className="text-sm text-blue-700">
                {extractedData.characters.join(', ')}
              </span>
            </div>
          )}
          {extractedData.situations.length > 0 && (
            <div>
              <span className="text-sm font-medium text-blue-800">状況: </span>
              <span className="text-sm text-blue-700">
                {extractedData.situations.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}