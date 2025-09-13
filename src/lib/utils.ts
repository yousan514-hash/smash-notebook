import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// パーセント帯の抽出
export function extractPercentBands(text: string): string[] {
  const percentRegex = /(\d+%|Kill%|kill%)/gi
  const matches = text.match(percentRegex)
  return matches ? [...new Set(matches.map(m => m.toLowerCase()))] : []
}

// 技名の簡単な抽出（カタカナ + 一部の技名パターン）
export function extractMoveNames(text: string): string[] {
  const moveRegex = /([ァ-ヶー]{2,}|DA|上強|下強|横強|上スマ|下スマ|横スマ|空N|空前|空後|空上|空下|NB|横B|上B|下B|掴み|投げ)/g
  const matches = text.match(moveRegex)
  return matches ? [...new Set(matches)] : []
}

// ローカルストレージのヘルパー
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Handle storage errors silently
  }
}