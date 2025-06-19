# VTuber AI Chat プロジェクト仕様書

## プロジェクト概要

### 目的
VTuber風オリジナルキャラクターとのAIチャットアプリケーションの開発

### コンセプト
- 現実のVTuberからインスパイアされたオリジナルキャラクター
- 倫理的配慮（実名使用なし、二次創作として明記）
- 個人情報収集なし、認証なしのシンプル設計

## 要件定義

### 機能要件

#### 基本機能
- [x] VTuber風オリジナルキャラクターとのAIチャット
- [x] キャラクター選択画面
- [x] リアルタイムチャット機能
- [ ] サーバーサイドMDファイルからキャラクター設定動的読み込み
- [x] 認証なし（ゲストユーザーのみ）
- [x] 会話履歴保存なし
- [x] 個人情報収集なし

#### キャラクター機能
- [x] 事前定義キャラクター（4体）
- [x] キャラクター別の性格・話し方・口癖
- [ ] MDファイルベースのキャラクター管理
- [ ] 動的プロンプト生成

### 技術要件

#### フロントエンド
- Next.js 15.3+ (App Router)
- TypeScript 5.8+
- Tailwind CSS
- React 19+

#### バックエンド
- Next.js API Routes
- Gemini 1.5 Flash API
- サーバーサイドAPIキー管理

#### インフラ
- Vercelデプロイ
- 環境変数による設定管理
- HTTPS通信

### セキュリティ要件
- [x] APIキーのクライアント露出防止
- [x] 個人情報取り扱いなし
- [x] HTTPS通信（Vercel標準）
- [ ] ログに機密情報を含めない

## アーキテクチャ設計

### ディレクトリ構成
```
next-vtuber-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts        # チャットAPI
│   │   ├── page.tsx                # メインページ
│   │   ├── layout.tsx              # レイアウト
│   │   └── globals.css             # グローバルスタイル
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatInterface.tsx   # チャットメイン
│   │   │   ├── MessageList.tsx     # メッセージ表示
│   │   │   └── MessageInput.tsx    # 入力フォーム
│   │   └── Character/
│   │       └── CharacterSelector.tsx # キャラ選択
│   ├── hooks/
│   │   └── useChat.ts              # チャット状態管理
│   ├── types/
│   │   ├── chat.ts                 # チャット型定義
│   │   └── character.ts            # キャラクター型定義
│   ├── data/
│   │   └── characters.ts           # キャラクターデータ
│   └── lib/
│       ├── gemini.ts               # Gemini API抽象化
│       └── character-loader.ts     # MDファイル読み込み
├── docs/
│   └── characters/
│       ├── mikorin.md              # みこりん設定
│       ├── peko-chan.md            # ぺこちゃん設定
│       ├── shark-chan.md           # シャーちゃん設定
│       └── neko-mimi.md            # ねこみみ設定
├── .env.local                      # 環境変数
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

### データフロー
```
ユーザー → キャラクター選択 → チャット画面
         ↓
フロントエンド → API Routes → Gemini API
         ↓
MDファイル読み込み → プロンプト生成 → レスポンス
```

## キャラクター設計

### オリジナルキャラクター一覧

#### 1. みこりん（さくらちゃん）
- **モチーフ**: 某有名VTuberからインスパイア
- **性格**: 明るい、元気、少し天然、親しみやすい、好奇心旺盛
- **話し方**: 関西弁混じりの親しみやすい話し方
- **口癖**: 「〜やで！」「めっちゃ」「わくわく〜」「みんなー！」
- **アバター**: 🌸

#### 2. ルナ様
- **モチーフ**: クール系VTuberからインスパイア
- **性格**: クール、知的、少しツンデレ、上品、時々甘える
- **話し方**: 丁寧語だが親しくなると少しタメ口になる
- **口癖**: 「〜ですわ」「まあ...」「フフ」「月の力で〜」
- **アバター**: 🌙

#### 3. こいちゃん
- **モチーフ**: 癒し系VTuberからインスパイア
- **性格**: 優しい、癒し系、少し恥ずかしがり、歌好き、思いやりがある
- **話し方**: ふんわりとした優しい話し方
- **口癖**: 「〜なの♪」「ふわふわ〜」「みんなだいすき」「歌いたいな〜」
- **アバター**: 🧜‍♀️

#### 4. ねこみみ
- **モチーフ**: 猫系VTuberからインスパイア
- **性格**: 甘えん坊、元気、少しわがまま、好奇心旺盛、人懐こい
- **話し方**: 猫らしい語尾と甘える話し方
- **口癖**: 「にゃん♪」「にゃー」「なでなでして〜」「みゃーみゃー」
- **アバター**: 🐱

## 実装フェーズ

### フェーズ1: 基盤構築 ✅
- [x] Next.jsプロジェクト作成
- [x] 基本コンポーネント実装
- [x] API Routes実装
- [x] 環境変数設定
- [x] 基本チャット機能

### フェーズ2: キャラクターシステム拡張 🚧
- [ ] MDファイルベースのキャラクター管理
- [ ] 動的プロンプト生成システム
- [ ] キャラクター設定のリッチ化

### フェーズ3: 最適化・デプロイ 📋
- [ ] パフォーマンス最適化
- [ ] エラーハンドリング強化
- [ ] Vercelデプロイ設定
- [ ] SEO対応

## 技術的詳細

### API設計

#### チャットAPI (`/api/chat`)
```typescript
// Request
interface ChatRequest {
  message: string;
  characterId: string;
}

// Response
interface ChatResponse {
  response: string;
  error?: string;
}
```

### 型定義

#### キャラクター型
```typescript
interface VTuberCharacter {
  id: string;
  name: string;
  description: string;
  personality: string;
  speechPattern: string;
  catchphrase: string[];
  avatar: string;
  color: string;
  background: string;
}
```

#### チャット型
```typescript
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  characterId?: string;
}
```

### 環境変数
```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

### Gemini API設定
- モデル: `gemini-1.5-flash`
- 理由: 無料枠で利用可能、高速レスポンス、日本語対応良好

## MDファイルベースキャラクター管理（計画）

### MDファイル構造例
```markdown
# みこりん

## 基本情報
- 名前: みこりん
- 年齢: 18歳（設定）
- 誕生日: 4月1日
- 身長: 155cm

## 性格特徴
- 明るく元気いっぱい
- 少し天然でドジっ子
- ゲームが大好き
- 視聴者との交流を大切にする

## 話し方・口癖
- 関西弁混じり
- 「〜やで！」「めっちゃ」が口癖
- 感情豊かで表現力が高い

## 好きなもの
- マインクラフト
- 歌うこと
- お菓子作り
- 猫

## 苦手なもの
- ホラーゲーム（でも頑張る）
- 早起き
- 辛い食べ物

## 配信スタイル
- ゲーム実況メイン
- 時々歌枠
- 雑談配信で視聴者と交流
```

## 開発環境セットアップ

### 必要なツール
- Node.js 18+
- npm または yarn
- Git
- VSCode（推奨）

### セットアップ手順
```bash
# 1. プロジェクト作成
npx create-next-app@latest next-vtuber-chat --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. 依存関係追加
cd next-vtuber-chat
npm install @google/generative-ai

# 3. 環境変数設定
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. 開発サーバー起動
npm run dev
```

### 開発コマンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
```

## デプロイメント

### Vercel設定
```bash
# Vercel CLI インストール
npm i -g vercel

# デプロイ
vercel

# 環境変数設定
vercel env add GEMINI_API_KEY
```

### 環境変数（本番）
- `GEMINI_API_KEY`: Gemini APIキー

## 課題と解決方針

### 現在の課題
1. **App Routerの構造エラー**: Next.js 15のApp Router形式に正しく対応する必要
2. **MDファイル読み込み未実装**: サーバーサイドでのファイル読み込み機能
3. **型安全性の向上**: より厳密な型定義とバリデーション

### 解決方針
1. ディレクトリ構造を正しく再構築
2. `fs`モジュールを使用したMDファイル読み込み機能実装
3. Zodなどのバリデーションライブラリ導入

## 倫理・法的配慮

### 著作権・肖像権対応
- 実在VTuberの名前・画像を直接使用しない
- 「インスパイア」「オマージュ」であることを明記
- 免責事項の表示

### 免責事項例
```
このアプリケーションのキャラクターは、実在のVTuberから
インスパイアされたオリジナルキャラクターです。
実在の人物・団体とは関係ありません。
```

## 今後の拡張案

### 機能拡張
- [ ] 音声入出力対応
- [ ] キャラクター学習機能
- [ ] カスタムキャラクター作成
- [ ] 多言語対応

### 技術拡張
- [ ] データベース導入
- [ ] 認証システム
- [ ] リアルタイム通信
- [ ] PWA対応

## 参考資料

### 技術資料
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gemini API Documentation](https://ai.google.dev/)

### デザイン参考
- VTuber配信プラットフォームのUI
- チャットアプリケーションのUX

---

**作成日**: 2025年6月18日  
**最終更新**: 2025年6月18日  
**バージョン**: 1.0.0