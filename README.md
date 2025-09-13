# smash-notebook
スマブラの戦術ノートアプリ (Next.js + Supabase)

## 機能

### A. DB・セキュリティ
- ✅ Prisma schema に ownerId を必須で保持（Profile参照）
- ✅ Card にインデックス (deckId, percentBand, situation) と (oppChar, oppMove)、Post に (createdAt) を追加
- ✅ Supabase RLSポリシー例を提供（本人のみ読書き・isPublic=true は閲覧可）

### B. デッキ画面の改善
- ✅ /deck/[id] にフィルタUIを追加（percentBand, situation, oppMove, tags）
- ✅ フィルタ選択は URL クエリに保存、初期表示時にクエリを反映
- ✅ 最近のフィルタは localStorage に保存し、候補として表示

### C. MDX安全化
- ✅ @mdx-js/react + remark/rehype を導入し、rehype-sanitize で危険なHTMLを無効化
- ✅ <Frame /> コンポーネントのみ許可し、card.answerMD を安全にMDXレンダリング
- ✅ 後方互換として改行テキストも表示可能

### D. テンプレート機能
- ✅ Template モデルを追加。フィールド: id, title, targetChar, section, percent, oppMove?, answerMD
- ✅ /deck/new に「00テンプレを展開」ボタンを追加。複数行をプレビューし、チェックした行だけカード下書き作成

### E. タグ強化
- ✅ カード作成/編集時にセクション（立ち回り/崖展開…）を自動タグ付け
- ✅ 手入力タグは Tag テーブルに正規化。既存タグからサジェスト候補を表示
- ✅ UIはチップ+オートコンプリート形式

### F. 投稿→カード化
- ✅ / (feed) の投稿作成時に、本文内の %帯 (00/50/80/Kill%) や技名を軽く抽出
- ✅ 「この投稿からカード草稿を作成」ボタンを追加 → デッキ選択 → 草稿カード生成 → 編集画面へ遷移

### G. UX改善
- ✅ Skeleton/Empty コンポーネントを追加し、/deck や /feed のローディング/空状態を改善
- ✅ エラー境界 (app/error.tsx, app/global-error.tsx) を実装
- ✅ モバイル用固定アクションバーを追加（＋新規カード / ＋投稿）
- ✅ タップ領域は44px以上にして片手操作に配慮

### H. 計測・メタ
- ✅ posthog-js を導入し、主要イベント（カード作成/タグ追加/フィルタ変更/投稿作成）を計測
- ✅ .env.example に DATABASE_URL を追加
- ✅ README にローカル→GitHub→Vercelの最短手順を追記

## 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **バックエンド**: Prisma ORM, Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **分析**: PostHog
- **MDX**: @mdx-js/react + rehype-sanitize
- **デプロイ**: Vercel

## セットアップ手順

### 1. ローカル開発環境

```bash
# リポジトリをクローン
git clone <repository-url>
cd smash-notebook

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集して必要な値を設定

# データベースをセットアップ
npx prisma generate
npx prisma db push

# Supabase RLSポリシーを適用
# supabase-rls-policies.sql の内容をSupabaseダッシュボードで実行

# 開発サーバーを起動
npm run dev
```

### 2. GitHub へのプッシュ

```bash
# Gitリポジトリを初期化（まだの場合）
git init
git add .
git commit -m "Initial commit"

# GitHubリポジトリを作成し、リモートを追加
git remote add origin https://github.com/yourusername/smash-notebook.git
git push -u origin main
```

### 3. Vercel へのデプロイ

1. [Vercel](https://vercel.com) にアクセス
2. GitHubアカウントでログイン
3. "New Project" をクリック
4. smash-notebook リポジトリを選択
5. 環境変数を設定：
   - `DATABASE_URL`: SupabaseのPostgreSQL接続URL
   - `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトURL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase匿名キー
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabaseサービスロールキー
   - `NEXT_PUBLIC_POSTHOG_KEY`: PostHogプロジェクトキー
   - `NEXT_PUBLIC_POSTHOG_HOST`: PostHogホスト（通常は `https://app.posthog.com`）
6. "Deploy" をクリック

### 4. 本番環境でのデータベース設定

```bash
# 本番環境でPrismaマイグレーションを実行
npx prisma migrate deploy

# Supabase RLSポリシーを本番環境に適用
# supabase-rls-policies.sql の内容をSupabaseダッシュボードで実行
```

## 環境変数

`.env.local` ファイルに以下の環境変数を設定してください：

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smash_notebook"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## データベーススキーマ

主要なテーブル：

- **profiles**: ユーザープロフィール
- **decks**: デッキ（カードの集合）
- **cards**: 戦術カード
- **posts**: 投稿
- **templates**: テンプレート
- **tags**: タグ

詳細は `prisma/schema.prisma` を参照してください。

## セキュリティ

- Supabase RLS (Row Level Security) を実装
- 本人のみ読書き、isPublic=true は閲覧可能
- MDXコンテンツは rehype-sanitize でサニタイズ
- 最小タップ領域44pxでアクセシビリティを確保

## 開発

```bash
# 開発サーバー起動
npm run dev

# データベーススタジオ
npm run db:studio

# Prismaクライアント生成
npm run db:generate

# データベースプッシュ
npm run db:push
```

## ライセンス

MIT License