# AI Character Chat

オリジナルキャラクターとの AI チャットアプリケーション

## 概要

このプロジェクトは、個性豊かなオリジナルキャラクターとチャットできる Web アプリケーションです。Google Gemini 1.5 Flash API を使用して AI 応答を生成し、各キャラクターが独自の性格や話し方で応答します。

## 特徴

- 🌸 **個性豊かなキャラクター**: みこりん、ルナ様、こいちゃん、ねこみみ、さくら
- 🤖 **AI 搭載**: Google Gemini 1.5 Flash API による自然な会話
- 💬 **リアルタイムチャット**: 即座に応答が返ってくる
- 🎨 **美しい UI**: Tailwind CSS によるモダンなデザイン
- 📱 **レスポンシブ**: モバイル・デスクトップ両対応
- 🔒 **プライバシー重視**: ユーザーデータ収集なし、認証不要

## キャラクター紹介

### みこりん 🌸

- **性格**: 元気いっぱい、関西弁、ゲーム好き
- **口癖**: 「〜やで！」「めっちゃ」「わくわく〜」

### ルナ様 🌙

- **性格**: クール、知的、少しツンデレ
- **口癖**: 「〜ですわ」「まあ...」「フフ」

### こいちゃん 🧜‍♀️

- **性格**: 優しい、癒し系、歌好き
- **口癖**: 「〜なの ♪」「ふわふわ〜」「みんなだいすき」

### ねこみみ 🐱

- **性格**: 甘えん坊、猫らしい、わがまま
- **口癖**: 「にゃん ♪」「にゃー」「なでなでして〜」

## 技術スタック

- **フロントエンド**: Next.js 15.3, React 19, TypeScript 5.8
- **スタイリング**: Tailwind CSS
- **AI API**: Google Gemini 1.5 Flash
- **デプロイ**: Vercel

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd md-character-chat
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local.example`を参考に`.env.local`ファイルを作成し、Gemini API キーを設定：

```bash
cp .env.local.example .env.local
```

`.env.local`を編集：

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## Gemini API キーの取得

1. [Google AI Studio](https://ai.google.dev/) にアクセス
2. Google アカウントでログイン
3. 「Get API Key」をクリックして API キーを生成
4. 生成された API キーを`.env.local`に設定

## プロジェクト構造

```
src/
├── app/
│   ├── api/chat/route.ts      # チャットAPI
│   ├── page.tsx               # メインページ
│   ├── layout.tsx             # レイアウト
│   └── globals.css            # グローバルスタイル
├── components/
│   ├── Chat/                  # チャット関連コンポーネント
│   └── Character/             # キャラクター関連コンポーネント
├── hooks/
│   └── useChat.ts             # チャット状態管理
├── types/
│   ├── chat.ts                # チャット型定義
│   └── character.ts           # キャラクター型定義
├── data/
│   └── characters.ts          # キャラクターデータ
└── lib/
    └── gemini.ts              # Gemini API連携
```

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
```

## デプロイ

### Vercel でのデプロイ

1. Vercel アカウントを作成
2. GitHub リポジトリを Vercel に接続
3. 環境変数`GEMINI_API_KEY`を Vercel で設定
4. 自動デプロイが開始されます

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 免責事項

このアプリケーションのキャラクターは、実在の人物・団体とは関係ありません。

## 貢献

プルリクエストやイシューの報告を歓迎します。

## サポート

質問や問題がある場合は、GitHub の Issues ページでお知らせください。
