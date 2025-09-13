# Smash Notebook

A tactics notebook app for Super Smash Bros built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Decks & Cards**: Organize tactics by percent band, situation, opponent move with MDX support
- **Feed**: Twitter-like posts with card attachments
- **Communities**: Character-specific communities with filtering and sorting
- **Card Creation**: Rich form with character selection and MDX editor

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Create a new Supabase project
   - Run the SQL schema in `supabase-schema.sql`
   - Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Project Structure

```
app/
├── (feed)/              # Feed pages
│   └── page.tsx         # Main feed
├── (deck)/              # Deck management
│   └── deck/
│       ├── page.tsx     # Decks list
│       ├── [id]/        # Individual deck
│       └── card/new/    # Card creation
├── (card)/              # Individual card pages
├── c/[character]/       # Character communities
├── compose/             # Post composer
└── communities/         # Communities list

components/
├── ui/                  # Base UI components
├── card-form.tsx        # Card creation form
├── deck-card.tsx        # Card display component
├── composer.tsx         # Post composer
├── post.tsx             # Post display
└── community-filters.tsx # Community filtering

src/
├── types/domain.ts      # Domain types
├── lib/supabase.ts      # Supabase client
└── actions/             # Server actions
    ├── deck-actions.ts
    ├── post-actions.ts
    └── community-actions.ts
```

## Core Types

- **PercentBand**: `'0-30' | '40-70' | '80+' | 'Kill%'`
- **Situation**: `'neutral' | 'ledgetrap' | 'edgeguard' | 'recovery' | 'combo' | 'line'`
- **Card**: Tactics with character matchup, situation, and MDX answer
- **Deck**: Collection of related cards
- **Post**: Feed posts with optional card attachments

## MDX Support

Cards support Markdown with custom components:
- `[YouTube:VIDEO_ID]` for YouTube embeds
- `<Frame title="Setup">content</Frame>` for highlighted sections
- Standard Markdown formatting

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for database and real-time features
- **MDX** for rich content

## Development

The app uses Server Actions for data mutations and includes:
- Real-time updates via Supabase
- Responsive design
- Accessible UI components
- Type-safe database operations
