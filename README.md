# Smash Notebook

スマブラの戦術ノートアプリ - プレイヤーの戦術を記録・共有・分析

## 🚀 機能

### 📚 デッキ・カード管理
- **デッキ作成**: キャラクター別や戦術別にカードを整理
- **カード作成**: シチュエーション、%帯、対策をMDXで記録
- **高度なフィルタ**: %帯、シチュエーション、相手の技、タグで絞り込み
- **URLクエリ連携**: フィルタ状態をURLで共有可能
- **最近のフィルタ**: localStorage連携で使いやすさを向上

### 🏷️ タグシステム
- **自動タグ付け**: シチュエーションに応じて関連タグを自動提案
- **タグサジェスト**: 既存タグからの入力補完
- **正規化**: Tag テーブルでタグを一元管理

### 📝 投稿・フィード
- **投稿作成**: 戦術や感想をコミュニティで共有
- **投稿→カード化**: 投稿内容から%帯・技名を抽出してカード草稿を自動生成
- **フィード**: 最新・トレンド投稿の閲覧

### 🎨 テンプレート機能
- **テンプレート管理**: よく使うカード構成をテンプレート化
- **一括展開**: 複数テンプレートを選択して一括でカード作成
- **プレビュー**: 作成前に内容を確認可能

### 🔒 セキュリティ・権限
- **Supabase RLS**: 行レベルセキュリティで適切な権限制御
- **MDX安全化**: rehype-sanitize で危険なHTML要素を無効化
- **カスタムコンポーネント**: `<Frame />` など許可されたコンポーネントのみ使用可能

### 📱 UX・モバイル対応
- **レスポンシブ**: モバイルファーストなデザイン
- **モバイルアクションバー**: 片手操作に配慮した固定ナビゲーション
- **44px以上のタップ領域**: アクセシビリティを考慮
- **Skeleton・Empty State**: ローディング・空状態の適切な表示
- **エラー境界**: 予期しないエラーの適切なハンドリング

### 📊 分析・計測
- **PostHog連携**: ユーザー行動の分析
- **主要イベント追跡**: カード作成、タグ追加、フィルタ変更など

## 🛠️ 技術スタック

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **ORM**: Prisma
- **MDX**: @mdx-js/react + rehype-sanitize
- **Analytics**: PostHog
- **UI**: Lucide React, class-variance-authority

## 🏗️ プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── deck/[id]/         # デッキ詳細・フィルタ機能
│   ├── deck/new/          # デッキ作成・テンプレート展開
│   ├── error.tsx          # エラー境界
│   └── global-error.tsx   # グローバルエラー境界
├── components/
│   ├── cards/             # カード関連コンポーネント
│   ├── posts/             # 投稿関連コンポーネント
│   ├── templates/         # テンプレート機能
│   ├── mdx/               # MDX安全化
│   ├── ui/                # 基本UIコンポーネント
│   └── layout/            # レイアウト・ナビゲーション
├── hooks/                 # カスタムフック
├── lib/                   # ユーティリティ・設定
├── types/                 # TypeScript型定義
└── prisma/
    └── schema.prisma      # データベーススキーマ
```

## 🚀 セットアップ手順

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd smash-notebook
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
cp .env.example .env.local
```

`.env.local` を編集して以下の値を設定:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smash_notebook"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY="your_posthog_key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

### 4. データベースのセットアップ
```bash
# Prisma スキーマを生成
npm run db:generate

# データベースにスキーマを適用
npm run db:push

# (または) マイグレーションを実行
npm run db:migrate
```

### 5. Supabase RLS ポリシーの適用
`supabase/policies.sql` の内容をSupabaseのSQL Editorで実行

### 6. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 🌐 デプロイ (Vercel)

### 1. GitHub連携
1. GitHubにリポジトリをプッシュ
2. [Vercel](https://vercel.com) でGitHubアカウントを連携
3. リポジトリを選択してプロジェクトをインポート

### 2. 環境変数の設定
Vercelのプロジェクト設定で以下の環境変数を設定:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXTAUTH_URL` (本番URLを設定)
- `NEXTAUTH_SECRET`

### 3. デプロイ
```bash
# 自動デプロイ (GitHub連携済みの場合)
git push origin main

# または手動デプロイ
npx vercel --prod
```

## 📝 開発ガイド

### データベース操作
```bash
# Prisma Studio (GUI) を起動
npm run db:studio

# スキーマ変更後の再生成
npm run db:generate

# 本番環境へのマイグレーション
npm run db:migrate
```

### コード品質
```bash
# リンター実行
npm run lint

# 型チェック
npx tsc --noEmit
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🙏 謝辞

- スマブラコミュニティの皆様
- 使用させていただいているオープンソースプロジェクトの開発者の皆様
