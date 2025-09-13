# smash-notebook
スマブラの戦術ノートアプリ (Next.js + Supabase)

## Vercel デプロイ設定

- Framework Preset: Next.js を選択
- Build Command: `next build`
- Output Directory: `.next`

上記を Vercel の Project Settings → Build & Development Settings で確認・保存したのち、Redeploy を実行してください。

デプロイ後の動作確認:
- `/api/health` にアクセスして `{ ok: true }` が返ることを確認
- トップページの「Open /deck」リンクから `/deck` へ遷移できることを確認
