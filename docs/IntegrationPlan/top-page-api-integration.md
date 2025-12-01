# TOPページ API連携 実装計画

## 概要

TOPページにバックエンドAPIを連携し、「今、注目の技術分野」と「総合ランキング」のデータを表示する実装。

## 目的

- モックデータからバックエンドAPIへの切り替え
- データ取得エラー時の適切なハンドリング
- 画像の表示とフォールバック処理
- カテゴリアイコンの動的表示

## API仕様

### 使用するエンドポイント

1. **カテゴリと書籍一覧**: `GET /categories/with-books`
   - レスポンス: カテゴリ情報と各カテゴリのトップ書籍
   
2. **総合ランキング**: `GET /rankings`
   - レスポンス: ランキング順の書籍リスト

### 接続先設定

- 環境変数 `VITE_API_URL` で指定（デフォルト: `http://localhost:8080`）

## 実装内容

### 1. OpenAPI クライアント設定

#### 新規ファイル
- `client/src/lib/openapi.ts`
  - OpenAPIクライアントのベースURL設定
  - 環境変数からの読み込み

#### 変更ファイル
- `client/src/main.tsx`
  - `initOpenAPI()` の呼び出しを追加

### 2. カスタムフック

#### 新規ファイル
- `client/src/hooks/useRankings.ts`
  - ランキングデータ取得用のReact Query フック

#### 既存ファイル
- `client/src/hooks/useCategories.ts`
  - カテゴリデータ取得用（既存）

### 3. コンポーネント修正

#### `client/src/pages/Home.tsx`
- モックデータのインポートを削除
- カスタムフックを使用してAPIからデータ取得
- ローディング状態の表示
- エラー状態の表示（「情報を取得に失敗しました」）
- APIレスポンスをコンポーネントのpropsにマッピング

#### `client/src/components/BookCard.tsx`
- NoImage画像のインポート
- `img`タグに`onError`ハンドラを追加
- 画像読み込み失敗時にNoImage表示

#### `client/src/components/TrendCard.tsx`
- NoImage画像のインポート
- `CategoryIcon`コンポーネントの使用
- `img`タグに`onError`ハンドラを追加

### 4. アセット

#### 新規ファイル
- `client/src/assets/no-image.svg`
  - 画像が取得できない場合のプレースホルダー

### 5. カテゴリアイコン

#### 新規ファイル
- `client/src/components/CategoryIcon.tsx`
  - アイコン名から絵文字へのマッピング
  - サポートするアイコン:
    - `robot`: 🤖
    - `pc`: 💻
    - `cloud`: ☁️
    - `security`: 🔒
    - `development`: 🛠️
    - `testing`: ✅
    - `infrastructure`: 📡
    - `network`: 🌐
  - マッチしないアイコン名の場合は何も表示しない

## データマッピング

### カテゴリセクション
```typescript
categories?.items?.map((category) => ({
  category: category.name,
  icon: category.icon,
  trendIndicator: category.trendIndicator || "注目",
  topBooks: category.books?.map((book) => ({
    id: book.id,
    title: book.title,
    coverImage: book.image,
  }))
}))
```

### ランキングセクション
```typescript
rankings?.items?.map((book) => ({
  id: book.id,
  rank: book.rank,
  title: book.title,
  author: book.author,
  publishDate: book.publishedAt || "不明",
  coverImage: book.image,
  rating: book.rating || 0,
  reviewCount: book.reviewCount || 0,
  qiitaMentions: book.mentions || 0,
  tags: book.tags || [],
  amazonUrl: book.amazonUrl,
  rakutenUrl: book.rakutenUrl,
}))
```

## エラーハンドリング

### 表示パターン

1. **ローディング中**: 「読み込み中...」
2. **エラー発生時**: 「情報を取得に失敗しました」（赤文字）
3. **画像読み込み失敗**: NoImage SVGを表示

### 実装方法

- React Queryの`isLoading`, `isError`状態を使用
- 条件分岐でUIを切り替え

## 環境変数

### `.env.example`
```
VITE_API_URL="http://localhost:8080"
```

### 使用箇所
- `client/src/lib/openapi.ts`

## 検証項目

- [ ] バックエンドが起動している場合、データが正しく表示される
- [ ] バックエンドが停止している場合、エラーメッセージが表示される
- [ ] 画像URLが無効な場合、NoImage画像が表示される
- [ ] カテゴリアイコンが正しく表示される
- [ ] 未定義のアイコン名の場合、何も表示されない
- [ ] 環境変数でAPI接続先を変更できる

## 今後の課題

- 検索機能の実装（APIが未実装）
- ローディング状態のUI改善（スケルトン表示など）
- エラーハンドリングのUI改善
