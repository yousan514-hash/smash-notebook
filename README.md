# smash-notebook
# Smash Notebook

スマブラの戦術ノートアプリ (Next.js + Supabase)

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. データベースURLを設定:
```bash
cp .env.example .env
# .envファイルのDATABASE_URLを実際のPostgreSQLのURLに変更
```

3. Prismaセットアップ:
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

4. 開発サーバー起動:
```bash
npm run dev
```

## Vercel デプロイ

1. Framework Preset: **Next.js**
2. Build Command: `next build`
3. Output Directory: `.next`
4. 環境変数にDATABASE_URLを設定

デプロイ後、404エラーが出る場合は:
- Project Settings → Framework Preset: Next.js / Build: next build / Output: .next を確認
- Redeploy

## 機能

- ✅ **404修正** (Vercel対応): vercel.json, public/.gitkeep, layout.tsx, page.tsx, health API
- ✅ **DBスキーマ** (Prisma + PostgreSQL): 完全なスキーマ定義、migration、seed
- ✅ **最小UI** (/deck, /deck/[id], CRUD操作): デッキ管理、カード作成・削除
- ✅ **キャラ選択×テンプレUI** (/deck/new): 82キャラ選択、テンプレート機能
- ✅ **投稿機能** (feed, composer, linkedCard preview): 投稿作成・表示、カードプレビュー

## 実装済みページ

- `/` - ホーム（投稿フィード + 投稿作成）
- `/deck` - デッキ一覧
- `/deck/new` - 新規デッキ作成（キャラ選択 + テンプレート）
- `/deck/[id]` - デッキ詳細（カード管理）
- `/api/health` - ヘルスチェック
- `/api/decks` - デッキ一覧API
- `/api/decks/[id]` - デッキ詳細API
- `/api/posts` - 投稿API

## 主要コンポーネント

### データベース
- **Profile**: ユーザープロフィール
- **Deck**: デッキ管理
- **Card**: 戦術カード（キャラ、%帯、状況、対策）
- **Post**: 投稿（linkedCard対応）
- **Tag/CardTag**: ハッシュタグシステム

### UI機能
- レスポンシブデザイン (Tailwind CSS)
- リアルタイムCRUD操作
- キャラクター選択（82キャラ対応）
- %帯・状況フィルタリング
- 投稿システム（カードリンク対応）

## 次のステップ

1. **データベース接続**: 本番環境でのPostgreSQL/Supabase接続
2. **認証システム**: Supabase Auth統合
3. **画像アップロード**: メディア投稿機能
4. **コミュニティ機能**: グループ・フォロー機能
5. **検索・フィルタ**: 高度な検索機能
