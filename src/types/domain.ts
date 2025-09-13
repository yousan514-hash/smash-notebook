export type PercentBand = '0-30' | '40-70' | '80+' | 'Kill%';

export type Situation =
  | 'neutral'
  | 'ledgetrap'
  | 'edgeguard'
  | 'recovery'
  | 'combo'
  | 'line';

export interface Card {
  id: string;
  deckId: string;
  myChar: string;
  oppChar: string;
  percentBand: PercentBand;
  situation: Situation;
  oppMove?: string | null;
  answerMD: string;
  created_at?: string;
}

export interface Deck {
  id: string;
  title: string;
  description?: string | null;
  created_at?: string;
}
