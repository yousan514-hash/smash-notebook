export type PercentBand = '00' | '50' | '80' | 'Kill'
export type Situation = '立ち回り' | '崖展開' | '撃墜' | '着地狩り' | '復帰阻止'

export interface FilterState {
  percentBand?: PercentBand
  situation?: Situation
  oppMove?: string
  tags?: string[]
}

export interface RecentFilter {
  id: string
  filter: FilterState
  timestamp: number
}