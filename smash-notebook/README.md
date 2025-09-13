# Smash Notebook

スマブラ（大乱闘スマッシュブラザーズ）の対策ノートをカードゲーム風に整理・共有できるSNSプラットフォーム

## 🎮 機能

### デッキシステム（カードゲーム形式）
- **キャラクター選択**: 全82キャラクター対応（マリオ〜ソラ）
- **セクション別整理**: 立ち回り / 崖展開 / 崖狩り / 復帰阻止 / ライン回復 / 崖上がり / 復帰
- **詳細な対策カード**: 自キャラ・相手キャラ・%帯・状況を指定した対策をカード化
- **ハッシュタグ管理**: 検索・フィルター機能で効率的に整理
- **テンプレート機能**: 00テンプレートを元にデッキを生成

### SNS機能
- **投稿システム**: 写真・動画・テキスト投稿に対応
- **ハッシュタグ連携**: 投稿とデッキを紐付け
- **いいね・コメント**: 他のプレイヤーとの交流
- **フォロー/フォロワー**: お気に入りのプレイヤーをフォロー

### コミュニティ
- **キャラクター別コミュニティ**: 使用キャラごとの情報交換
- **研究テーマ別コミュニティ**: 特定のテクニックや戦術の研究
- **リアルタイムチャット**: LINE風のチャットスペース
- **DAO報酬システム**: デッキのシェア・利用でトークン獲得（将来実装）

### アカウント管理
- **OAuth認証**: Google/Twitter連携
- **Web3ウォレット連携**: MetaMask対応（準備中）

## 🛠 技術スタック

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Server Actions
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel対応

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # 認証ページ
│   ├── community/         # コミュニティ機能
│   ├── compose/           # 投稿作成
│   ├── deck/              # デッキ管理
│   ├── feed/              # フィード
│   └── api/               # API Routes
├── components/            # Reactコンポーネント
│   ├── ui/               # UIコンポーネント
│   └── navigation.tsx    # ナビゲーション
└── lib/                  # ユーティリティ
    ├── characters.ts     # キャラクターデータ
    ├── prisma.ts        # Prismaクライアント
    ├── types.ts         # 型定義
    └── utils.ts         # ヘルパー関数
```

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?schema=public"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. データベースのセットアップ

```bash
# Prismaスキーマをデータベースにプッシュ
npm run db:push

# サンプルデータを投入
npm run db:seed

# Prisma Studioでデータベースを確認（オプション）
npm run db:studio
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 📊 データモデル

### 主要なエンティティ

- **User**: ユーザー情報（OAuth認証、Web3ウォレット対応）
- **Character**: スマブラキャラクター（00〜86番まで全キャラ）
- **Deck**: デッキ（キャラクター別の対策集）
- **Card**: 対策カード（具体的な対策内容）
- **Post**: SNS投稿（デッキとの紐付け可能）
- **Community**: コミュニティ（チャット機能付き）

### ドメインルール

```typescript
// 型定義
type PercentBand = '0-30' | '40-70' | '80+' | 'Kill%'
type Situation = 'neutral' | 'ledgetrap' | 'edgeguard' | 'recovery' | 'combo' | 'line'
type Section = '立ち回り' | '崖展開' | '崖狩り' | '復帰阻止' | 'ライン回復' | '崖上がり' | '復帰'

// カード構造
interface Card {
  id: string
  myChar: string        // 自分のキャラクター
  oppChar: string       // 相手のキャラクター
  percentBand: PercentBand
  situation: Situation
  section: Section
  oppMove?: string      // 相手の行動
  answerMD: string      // 対策内容（Markdown）
  tags: string[]
}
```

## 🎯 主要ページ

- **/** - ホームページ（人気デッキ、機能紹介）
- **/deck** - デッキ一覧（検索・フィルター機能）
- **/deck/create** - デッキ作成
- **/deck/[id]** - デッキ詳細（カード表示）
- **/feed** - フィード（投稿一覧）
- **/compose** - 投稿作成
- **/community** - コミュニティ一覧
- **/community/[id]** - コミュニティ詳細（チャット）

## 🔧 開発用コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# リンター実行
npm run lint

# データベース操作
npm run db:push    # スキーマをDBにプッシュ
npm run db:seed    # サンプルデータ投入
npm run db:studio  # Prisma Studio起動
```

## 📝 今後の実装予定

- [ ] Web3ウォレット連携（MetaMask）
- [ ] DAO報酬システム
- [ ] 画像・動画アップロード機能
- [ ] プッシュ通知
- [ ] モバイルアプリ対応
- [ ] 大会・イベント機能
- [ ] AIによる対策提案

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。開発に参加する場合は、以下の手順に従ってください：

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- 任天堂株式会社 - 大乱闘スマッシュブラザーズシリーズ
- スマブラコミュニティの皆様
- オープンソースライブラリの開発者の皆様