# トラブルシューティングガイド

## このドキュメントについて

VTuber AI Chatプロジェクト開発中によく発生する問題と、その解決方法をまとめたガイドです。

## 環境関連の問題

### 1. Node.jsバージョンエラー

**エラー例:**
```
Error: The engine "node" is incompatible with this module
```

**原因:** Node.jsのバージョンが古い

**解決方法:**
```bash
# Node.jsバージョン確認
node --version

# Node.js 18以上にアップデート
# nodenvを使用している場合
nodenv install 18.19.0
nodenv global 18.19.0

# nvmを使用している場合
nvm install 18.19.0
nvm use 18.19.0
```

### 2. パッケージインストールエラー

**エラー例:**
```
npm ERR! peer dep missing
```

**解決方法:**
```bash
# node_modules削除
rm -rf node_modules package-lock.json

# 再インストール
npm install

# または強制インストール
npm install --force
```

## Next.js関連の問題

### 3. App Routerの構造エラー

**エラー例:**
```
Module not found: Can't resolve '@/components/Character/CharacterSelector'
```

**原因:** ファイルがsrc/ディレクトリ内に配置されていない

**解決方法:**
```bash
# 正しいディレクトリ構造を確認
ls -la src/components/

# ファイルが存在しない場合は移動
mkdir -p src/components/Character
mv components/Character/* src/components/Character/
```

### 4. TypeScript パスエイリアスエラー

**エラー例:**
```
Cannot find module '@/types/chat' or its corresponding type declarations
```

**解決方法:**
`tsconfig.json`の設定を確認:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 5. API Routes構造エラー (App Router)

**エラー例:**
```
404 - This page could not be found
```

**原因:** App RouterでのAPI Routes構造が間違っている

**正しい構造:**
```
src/app/api/chat/route.ts  ✅
pages/api/chat.ts          ❌ (Pages Router形式)
```

**解決方法:**
```bash
mkdir -p src/app/api/chat
# pages/api/chat.ts を src/app/api/chat/route.ts に移動し、
# export default function を export async function POST に変更
```

## Gemini API関連の問題

### 6. APIキー設定エラー

**エラー例:**
```
APIキーが設定されていません
```

**解決方法:**
```bash
# .env.localファイルの存在確認
ls -la .env.local

# ファイルが存在しない場合は作成
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 権限確認
chmod 600 .env.local
```

### 7. Geminiモデルエラー

**エラー例:**
```
models/gemini-pro is not found for API version v1beta
```

**原因:** 廃止されたモデル名を使用している

**解決方法:**
モデル名を更新:
```typescript
// ❌ 旧バージョン
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// ✅ 新バージョン
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
```

### 8. API利用制限エラー

**エラー例:**
```
429 Too Many Requests
```

**原因:** API利用制限に達した

**解決方法:**
1. APIキーの利用状況を確認
2. リクエスト頻度を調整
3. 必要に応じて有料プランに変更

## TypeScript関連の問題

### 9. 型定義エラー

**エラー例:**
```
Property 'env' does not exist on type 'ImportMeta'
```

**解決方法:**
`src/vite-env.d.ts`または型定義ファイルを作成:
```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare namespace NodeJS {
  interface ProcessEnv {
    GEMINI_API_KEY: string;
  }
}
```

### 10. インポートパスエラー

**エラー例:**
```
Module '"@/data/characters"' has no exported member 'getCharacterById'
```

**解決方法:**
エクスポート/インポートを確認:
```typescript
// characters.ts
export const getCharacterById = (id: string) => { ... }

// 使用側
import { getCharacterById } from '@/data/characters';
```

## UI/スタイリング関連の問題

### 11. Tailwind CSSが効かない

**エラー例:**
スタイルが適用されない

**解決方法:**
1. `tailwind.config.js`のcontent設定を確認:
```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
}
```

2. CSS インポートを確認:
```typescript
// src/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 12. レスポンシブデザインの問題

**問題:** モバイルでレイアウトが崩れる

**解決方法:**
適切なブレークポイントを使用:
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
```

## デプロイ関連の問題

### 13. Vercelビルドエラー

**エラー例:**
```
Build failed with exit code 1
```

**解決方法:**
1. ローカルでビルドテスト:
```bash
npm run build
```

2. TypeScriptエラーの修正
3. 環境変数の設定確認

### 14. 環境変数が読み込まれない

**問題:** Vercelで環境変数が効かない

**解決方法:**
1. Vercelダッシュボードで環境変数を設定
2. プレビューと本番環境両方に設定
3. デプロイを再実行

## パフォーマンス関連の問題

### 15. チャット応答が遅い

**原因と解決方法:**
1. **APIキー制限:** 利用状況を確認
2. **プロンプト長すぎ:** プロンプトを最適化
3. **ネットワーク:** 接続状況を確認

### 16. メモリリーク

**症状:** 長時間使用でブラウザが重くなる

**解決方法:**
useEffect のクリーンアップを確認:
```typescript
useEffect(() => {
  const timer = setInterval(() => { ... }, 1000);
  return () => clearInterval(timer); // クリーンアップ
}, []);
```

## デバッグ手法

### 開発者ツールの活用

1. **ネットワークタブ:** API リクエスト/レスポンスを確認
2. **コンソールタブ:** エラーメッセージとログを確認
3. **Sourceタブ:** ブレークポイントでデバッグ

### ログ出力

```typescript
// API Routes でのデバッグ
console.log('Request:', { message, characterId });
console.log('Character found:', character);
console.log('Response:', text);

// フロントエンドでのデバッグ
console.log('Chat state:', chatState);
console.log('Sending message:', content);
```

### エラー境界の実装

```typescript
// error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 予防策

### 1. 型安全性の確保
- 厳密なTypeScript設定
- Zodでのバリデーション
- 適切な型注釈

### 2. エラーハンドリング
- try-catch文の適切な使用
- ユーザーフレンドリーなエラーメッセージ
- フォールバック処理

### 3. テスト
- 単体テストの実装
- E2Eテスト
- API エンドポイントのテスト

### 4. 監視
- エラー監視ツール（Sentry等）
- パフォーマンス監視
- ログ分析

## よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルドテスト
npm run build

# 型チェック
npx tsc --noEmit

# リンター実行
npm run lint

# 依存関係確認
npm list

# キャッシュクリア
npm start -- --reset-cache
rm -rf .next node_modules package-lock.json
npm install
```

## 参考リンク

- [Next.js Troubleshooting](https://nextjs.org/docs/messages)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Tailwind CSS Troubleshooting](https://tailwindcss.com/docs/installation/troubleshooting)
- [Vercel Deployment Issues](https://vercel.com/docs/troubleshooting)

---

問題が解決しない場合は、GitHub Issuesに詳細な状況とエラーメッセージを投稿してください。