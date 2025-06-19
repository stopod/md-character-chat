# CLAUDE.md

このファイルはClaude Code (claude.ai/code) がこのリポジトリでコード作業を行う際のガイダンスを提供します。

## プロジェクト概要

オリジナルキャラクターとチャットできるAIチャットアプリケーションです。Next.js 15.3+ + TypeScript、Tailwind CSS、Google Gemini 1.5 Flash APIを統合して開発されています。

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# リンター実行
npm run lint

# 型チェック
npx tsc --noEmit
```

## プロジェクトアーキテクチャ

### 基本構成
- **フロントエンド**: Next.js 15+ (App Router)、TypeScript 5.8+、React 19+、Tailwind CSS
- **バックエンド**: Next.js API Routes + Gemini 1.5 Flash統合
- **デプロイ**: Vercel + 環境変数管理

### ディレクトリ構成
```
src/
├── app/
│   ├── api/chat/route.ts        # チャットAPIエンドポイント
│   ├── page.tsx                 # メインページ
│   ├── layout.tsx               # ルートレイアウト
│   └── globals.css              # グローバルスタイル
├── components/
│   ├── Chat/                    # チャットインターフェースコンポーネント
│   └── Character/               # キャラクター選択コンポーネント
├── hooks/
│   └── useChat.ts               # チャット状態管理
├── types/
│   ├── chat.ts                  # チャット型定義
│   └── character.ts             # キャラクター型定義
├── data/
│   └── characters.ts            # キャラクターデータ
└── lib/
    ├── gemini.ts                # Gemini APIラッパー
    └── character-loader.ts      # MDファイル読み込み（計画中）
```

### キャラクターシステム
アプリケーションには個性豊かなオリジナルキャラクターが登場：
- **みこりん**: 元気、関西弁、ゲーム好き (🌸)
- **ルナ様**: クール、知的、少しツンデレ (🌙)
- **こいちゃん**: 優しい、癒し系、歌好き (🧜‍♀️)
- **ねこみみ**: 猫らしい、甘えん坊、注目を求める (🐱)

## 重要な実装詳細

### API統合
- Gemini 1.5 Flashモデル (`gemini-1.5-flash`) を使用
- APIキーはサーバーサイドで環境変数により管理
- チャットAPIエンドポイント: `/api/chat` (POST)

### 型システム
重要なインターフェース:
- `ChatCharacter`: 性格、話し方を含むキャラクター定義
- `ChatMessage`: role、content、timestampを持つメッセージ構造
- `ChatRequest/ChatResponse`: API通信用の型

### 環境変数
`.env.local` とVercelで必要:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## 開発ガイドライン

### App Routerの使用
- Next.js 15 App Router構造 (`src/app/`) を使用
- API Routesは `src/app/api/*/route.ts` 形式
- インポートエイリアス `@/*` は `src/*` に設定

### キャラクター管理
- キャラクターは現在 `src/data/characters.ts` で定義
- 将来的にMDファイルベースのキャラクター読み込みを実装予定
- キャラクターの性格特徴に基づく動的プロンプト生成

### スタイリングアプローチ
- すべてのスタイリングにTailwind CSSを使用
- モバイルファーストのレスポンシブデザイン
- キャラクター固有のカラーテーマとアバター

## よくある問題と解決方法

### App Router移行
API routesが正しい構造に従っていることを確認:
```
✅ src/app/api/chat/route.ts
❌ pages/api/chat.ts
```

### Gemini APIモデル
現在のモデル名を使用:
```typescript
// ✅ 現在
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ❌ 廃止予定
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
```

### TypeScriptパス解決
`tsconfig.json` に適切なパスマッピングが含まれていることを確認:
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

## 今後の開発計画

### フェーズ2: キャラクターシステム拡張
- `docs/characters/` でのMDファイルベースキャラクター管理
- キャラクターファイルからの動的プロンプト生成
- `fs` モジュールを使用したサーバーサイドキャラクター読み込み

### フェーズ3: 最適化と機能追加
- パフォーマンス最適化
- エラーハンドリング強化
- 音声入出力機能
- カスタムキャラクター作成

## セキュリティと倫理

- ユーザー認証やデータ永続化なし
- APIキーはサーバーサイドでのみ保護
- オリジナルで作成されたキャラクター設定
- 個人情報の収集なし
- インスピレーション元への適切な帰属と免責事項