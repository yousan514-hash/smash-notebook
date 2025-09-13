# Smash Notebook

スマブラの戦術ノートアプリ (Next.js + Supabase + Prisma)

## 機能

### 🎮 デッキ管理
- キャラクター別の対策デッキを作成・管理
- 公開/非公開の設定
- %帯・シチュエーション・技別のカード管理

### 🔍 高度なフィルタリング
- %帯（00/50/80/Kill）でフィルタ
- シチュエーション（立ち回り/崖展開/撃墜など）でフィルタ
- 相手の技でフィルタ
- タグでフィルタ
- URLクエリ保存・最近のフィルタ履歴

### 📝 MDX対応
- カードの回答をMDX形式で記述
- `<Frame>`コンポーネントで重要情報を強調
- rehype-sanitizeによる安全なレンダリング

### 🎯 テンプレート機能
- キャラクター別のテンプレートを用意
- 複数テンプレートを一括展開
- カスタムテンプレートの作成

### 🏷️ スマートタグ
- セクション選択時の自動タグ付け
- 既存タグからのオートコンプリート
- タグの正規化と管理

### 📢 フィード機能
- 戦術や気づきを投稿
- %帯や技名の自動抽出
- 投稿からカード草稿への変換

### 📱 モバイル対応
- レスポンシブデザイン
- 44px以上のタップ領域
- 固定アクションバー

### 📊 分析
- PostHogによるイベントトラッキング
- 主要アクションの計測

## セットアップ

### 必要な環境
- Node.js 18以上
- PostgreSQL（Supabase推奨）

### ローカル開発

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/smash-notebook.git
cd smash-notebook
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数を設定
```bash
cp .env.example .env.local
```

`.env.local`を編集して以下を設定：
- `DATABASE_URL`: PostgreSQLの接続URL
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの公開鍵
- `SUPABASE_SERVICE_ROLE_KEY`: Supabaseのサービスロールキー（オプション）
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHogのAPIキー（オプション）

4. データベースをセットアップ
```bash
npm run db:push
```

5. 開発サーバーを起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

### Supabaseセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成

2. SQLエディタで`prisma/rls-policies.sql`のRLSポリシーを実行

3. Authentication > Providers でお好みの認証プロバイダーを有効化

### デプロイ（GitHub → Vercel）

1. GitHubにリポジトリをプッシュ
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. [Vercel](https://vercel.com)でプロジェクトをインポート
   - GitHubアカウントを連携
   - リポジトリを選択
   - 環境変数を設定（.env.localと同じ内容）

3. デプロイ完了！

## 開発

### ディレクトリ構造
```
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
├── lib/             # ユーティリティ・設定
├── prisma/          # Prismaスキーマ・マイグレーション
├── types/           # TypeScript型定義
├── utils/           # ヘルパー関数
└── public/          # 静的ファイル
```

### 主要なコマンド
```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動
npm run lint         # ESLintチェック
npm run db:push      # DBスキーマ更新
npm run db:generate  # Prisma Clientの生成
npm run db:studio    # Prisma Studioを起動
```

## ライセンス

MIT License