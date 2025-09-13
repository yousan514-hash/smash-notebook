import { PercentBand, Situation } from '@prisma/client'

export { PercentBand, Situation }

export const PERCENT_BAND_LABELS = {
  PERCENT_0_30: '0-30%',
  PERCENT_40_70: '40-70%', 
  PERCENT_80_PLUS: '80%+',
  KILL: 'Kill%'
} as const

export const SITUATION_LABELS = {
  neutral: '立ち回り',
  ledgetrap: '崖展開',
  edgeguard: '崖狩り',
  recovery: '復帰阻止',
  combo: 'ライン回復',
  line: '崖上がり'
} as const

export function percentBandToLabel(band: PercentBand): string {
  return PERCENT_BAND_LABELS[band]
}

export function situationToLabel(situation: Situation): string {
  return SITUATION_LABELS[situation]
}