export type DeckFilter = {
  percentBand?: number; // 0|50|80|999
  situation?: string; // enum key
  oppMove?: string;
  tags?: string[];
};

export function readDeckFilterFromSearchParams(params: URLSearchParams): DeckFilter {
  const percent = params.get('percentBand');
  const situation = params.get('situation') || undefined;
  const oppMove = params.get('oppMove') || undefined;
  const tags = params.getAll('tags');
  return {
    percentBand: percent ? Number(percent) : undefined,
    situation,
    oppMove,
    tags: tags.length ? tags : undefined,
  };
}

export function writeDeckFilterToSearchParams(filter: DeckFilter, base?: URLSearchParams): URLSearchParams {
  const sp = new URLSearchParams(base ? base.toString() : '');
  // Clear existing keys
  ['percentBand', 'situation', 'oppMove', 'tags'].forEach((k) => sp.delete(k));
  if (filter.percentBand !== undefined) sp.set('percentBand', String(filter.percentBand));
  if (filter.situation) sp.set('situation', filter.situation);
  if (filter.oppMove) sp.set('oppMove', filter.oppMove);
  if (filter.tags && filter.tags.length) filter.tags.forEach((t) => sp.append('tags', t));
  return sp;
}

export const PERCENT_BANDS = [0, 50, 80, 999];
export const SITUATIONS = [
  'NEUTRAL',
  'ADVANTAGE',
  'DISADVANTAGE',
  'EDGE_GUARD',
  'LEDGE_TRAP',
] as const;

export function saveRecentDeckFilter(filter: DeckFilter) {
  if (typeof window === 'undefined') return;
  try {
    const key = 'recentDeckFilters';
    const prev: DeckFilter[] = JSON.parse(localStorage.getItem(key) || '[]');
    const next = [filter, ...prev.filter((f) => JSON.stringify(f) !== JSON.stringify(filter))].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {}
}

export function loadRecentDeckFilters(): DeckFilter[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = 'recentDeckFilters';
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}
