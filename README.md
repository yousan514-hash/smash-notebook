# Smash Notebook
スマブラの戦術ノートアプリ (Next.js + Supabase)

## 概要

Smash Notebookは、大乱闘スマッシュブラザーズの戦術をカード形式で整理し、コミュニティで共有できるSNS機能を持ったWebアプリケーションです。

## 機能

### 🎮 戦術ノート管理
- **カード形式のUI**: 戦術を見やすいカード形式で表示
- **キャラクター別整理**: 全スマブラキャラクターに対応
- **状況別分類**: ニュートラル、コンボ、復帰阻止など詳細な状況分類
- **タグシステム**: 自由なタグ付けによる柔軟な分類

### 🔍 検索・フィルタリング
- **リアルタイム検索**: タイトル、内容、タグから瞬時に検索
- **キャラクター絞り込み**: 特定のキャラクターの戦術のみを表示
- **複合フィルタ**: 検索とキャラクター絞り込みの組み合わせ

### 🌐 SNS機能
- **戦術共有**: 作成した戦術ノートを他のユーザーと共有
- **いいね機能**: 有用な戦術にいいねで評価
- **コメント機能**: 戦術について議論やアドバイス（UI実装済み）
- **シェア機能**: ネイティブシェアAPIまたはクリップボードコピー

## 技術スタック

- **フロントエンド**: Next.js 15.5.3 (App Router)
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth（準備済み）
- **アイコン**: Lucide React

## セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/yousan514-hash/smash-notebook.git
cd smash-notebook
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
`.env.local`ファイルを作成し、Supabaseの設定を追加：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. データベースのセットアップ
Supabaseプロジェクトで以下のSQLを実行：

```sql
-- ユーザーテーブル
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 戦術ノートテーブル
CREATE TABLE tactical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  character TEXT NOT NULL,
  situation TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT true
);

-- いいねテーブル
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  note_id UUID REFERENCES tactical_notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

-- 統計情報付きノートビュー
CREATE VIEW notes_with_stats AS
SELECT 
  tn.*,
  u.name as user_name,
  u.avatar_url as user_avatar,
  COUNT(l.id) as likes_count
FROM tactical_notes tn
LEFT JOIN users u ON tn.user_id = u.id
LEFT JOIN likes l ON tn.id = l.note_id
GROUP BY tn.id, u.name, u.avatar_url;
```

### 5. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## デモモード

Supabaseが設定されていない場合、アプリケーションはデモモードで動作し、サンプルデータを表示します。全ての機能をテストできますが、実際のデータ保存は行われません。

## ディレクトリ構造

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # グローバルスタイル
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # ホームページ
├── components/         # Reactコンポーネント
│   ├── TacticalNoteCard.tsx    # 戦術ノートカード
│   └── CreateNoteModal.tsx     # 新規作成モーダル
├── lib/                # ユーティリティ
│   └── supabase.ts     # Supabase設定
└── types/              # TypeScript型定義
    └── index.ts        # 共通型定義

docs/                   # ドキュメント
└── database-schema.md  # データベース設計書
```

## 対応キャラクター

全スマブラキャラクター（80体以上）に対応：
- スーパーマリオシリーズ（Mario, Luigi, Peach, Bowser...）
- ポケモンシリーズ（Pikachu, Pichu, Mewtwo...）
- ゼルダシリーズ（Link, Zelda, Ganondorf...）
- その他多数のキャラクター

## 今後の拡張予定

- [ ] ユーザー認証システムの実装
- [ ] コメント機能のバックエンド実装
- [ ] 戦術ノートの詳細ページ
- [ ] いいね機能の永続化
- [ ] プロフィールページ
- [ ] フォロー機能
- [ ] 通知システム
- [ ] モバイルアプリ対応

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。
