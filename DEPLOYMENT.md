# デプロイメントガイド

## Vercelデプロイ手順

### 1. 前提条件
- GitHubリポジトリの準備
- Vercelアカウントの作成
- Google Gemini API キーの取得

### 2. Vercelプロジェクトのセットアップ

```bash
# Vercel CLIのインストール（初回のみ）
npm i -g vercel

# プロジェクトのデプロイ
vercel

# 本番環境へのデプロイ
vercel --prod
```

### 3. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

- `GEMINI_API_KEY`: Google Gemini APIキー

### 4. カスタムドメイン設定（オプション）

1. Vercelダッシュボードでプロジェクトを選択
2. Settings > Domains
3. カスタムドメインを追加

### 5. Analytics設定（オプション）

```bash
# Vercel Analyticsの有効化
npm install @vercel/analytics
```

## パフォーマンス最適化

### ビルド時最適化
- Gzip圧縮の有効化
- 画像最適化の設定
- セキュリティヘッダーの設定

### 監視とメトリクス
- Core Web Vitals の監視
- API レスポンス時間の監視
- エラー率の追跡

## トラブルシューティング

### よくある問題

1. **ビルドエラー**
   ```bash
   npm run type-check
   npm run lint
   ```

2. **API エラー**
   - 環境変数の確認
   - Gemini API キーの有効性確認

3. **パフォーマンス問題**
   ```bash
   npm run build:analyze
   ```

### ログの確認

Vercelダッシュボードの Functions タブでサーバーログを確認できます。

## セキュリティ

- APIキーは環境変数で管理
- セキュリティヘッダーの設定済み
- HTTPS強制
- XSS攻撃対策

## 本番環境での注意事項

1. API使用量の監視
2. エラー率の監視  
3. レスポンス時間の監視
4. 定期的なセキュリティアップデート