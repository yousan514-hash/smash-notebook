# Smash Notebook

スマブラの戦術ノートアプリ (Next.js 14 App Router + TypeScript + Tailwind + Supabase)

## 開発

1. 依存関係をインストール

```bash
pnpm install
```

2. 環境変数を設定

`.env.example` を `.env.local` にコピーして値を設定します。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. 開発サーバー起動

```bash
pnpm dev
```

### スマホ実機で確認 (0.0.0.0 バインド)

- macOS/Linux:

```bash
HOST=0.0.0.0 pnpm dev
```

- Windows PowerShell:

```powershell
$env:HOST="0.0.0.0"; pnpm dev
```

同一ネットワーク上のスマホから `http://<PCのIP>:3000` にアクセスしてください。

## 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase