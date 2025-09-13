# Smash Notes

スマブラの戦術ノートアプリ (Next.js + Prisma + Supabase)

## セットアップ

1) 依存関係のインストール

```bash
pnpm i # or npm i / yarn
```

2) 環境変数

`.env` を作成（`.env.example` をコピー）し、`DATABASE_URL`（Supabase Postgres）を設定します。

3) Prisma セットアップ

```bash
pnpm prisma:generate
pnpm prisma:migrate --name init
```

4) 開発サーバー

```bash
pnpm dev
```

## デプロイ（ローカル → GitHub → Vercel）

- GitHub にプッシュ
- Vercel にインポートし、`DATABASE_URL` と Supabase の環境変数を設定
- デプロイ

## Supabase RLS ポリシー例

`Deck` / `Card` / `Post` は `ownerId` を持ち、`isPublic=true` のとき公開閲覧可。所有者は読み書き可。

```sql
-- RLS 有効化
alter table "Deck" enable row level security;
alter table "Card" enable row level security;
alter table "Post" enable row level security;

-- 所有者は読み書き可
create policy "deck_owner_rw" on "Deck"
  for all using (ownerId = auth.uid()) with check (ownerId = auth.uid());

create policy "card_owner_rw" on "Card"
  for all using (ownerId = auth.uid()) with check (ownerId = auth.uid());

create policy "post_owner_rw" on "Post"
  for all using (ownerId = auth.uid()) with check (ownerId = auth.uid());

-- 公開閲覧可
create policy "deck_public_read" on "Deck"
  for select using (isPublic = true);

create policy "card_public_read" on "Card"
  for select using (isPublic = true);

create policy "post_public_read" on "Post"
  for select using (isPublic = true);
```

`ownerId` は `auth.users` の UUID を使用してください。別テーブル `Profile` を使う場合は `id = auth.uid()` を同期させます。
