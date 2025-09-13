# smash-notebook
スマブラの戦術ノートアプリ (Next.js + Supabase)

Next.js 14 + TypeScript + Tailwind + Supabase.

## Setup

1. Install deps: `npm install`
2. Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Create Supabase tables:

```sql
create table if not exists decks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  deckId uuid references decks(id) on delete cascade not null,
  myChar text not null,
  oppChar text not null,
  percentBand text not null check (percentBand in ('0-30','40-70','80+','Kill%')),
  situation text not null check (situation in ('neutral','ledgetrap','edgeguard','recovery','combo','line')),
  oppMove text,
  answerMD text not null,
  created_at timestamp with time zone default now()
);
```

4. Run dev server: `npm run dev`

Routes:
- `/deck` – list/create/delete decks
- `/deck/[id]` – deck detail with cards, delete card
- `/deck/card/new` – create card
