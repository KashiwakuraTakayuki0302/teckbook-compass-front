# 書籍詳細画面 API連携 実装計画

## 概要

書籍詳細画面（BookDetail）にバックエンドAPIを連携し、技術書の詳細情報を表示する実装。

## 目的

- モックデータからバックエンドAPIへの切り替え
- `/books/{bookId}` エンドポイントを使用した詳細情報の取得
- TOPページから詳細画面への遷移機能の実装
- 共通レイアウト（ヘッダー・フッター）の導入

## API仕様

### 使用するエンドポイント

**書籍詳細取得**: `GET /books/{bookId}`

#### リクエストパラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| bookId | string | ✓ | 取得したい書籍のID（ISBN形式） |

#### レスポンス（BookDetail型）
```typescript
{
  bookId?: string;           // 書籍ID（ISBN形式）
  title?: string;            // 書籍タイトル
  author?: string;           // 著者名
  publishedDate?: string;    // 出版日
  price?: number;            // 価格
  isbn?: string;             // ISBN
  bookImage?: string;        // 書籍画像URL
  tags?: string[];           // タグ配列
  overview?: string;         // 書籍の概要
  aboutThisBook?: string[];  // この本について（ポイント）
  trendingPoints?: string[]; // 注目ポイント
  amazonReviewSummary?: {    // Amazonレビューサマリー
    averageRating?: number;
    totalReviews?: number;
  };
  featuredReviews?: Array<{  // 注目レビュー
    reviewer?: string;
    date?: string;
    rating?: number;
    comment?: string;
  }>;
  purchaseLinks?: {          // 購入リンク
    amazon?: string;
    rakuten?: string;
  };
}
```

#### エラーレスポンス
| ステータスコード | 説明 |
|----------------|------|
| 400 | Bad request |
| 404 | Book not found |
| 500 | Internal server error |

## 実装内容

### 1. OpenAPI クライアント生成

#### コマンド
```bash
pnpm generate:api
```

#### 生成されるファイル
- `client/src/api/services/BooksService.ts`
- `client/src/api/models/BookDetail.ts`
- `client/src/api/models/AmazonReviewSummary.ts`
- `client/src/api/models/Review.ts`
- `client/src/api/models/PurchaseLinks.ts`

#### 修正が必要なファイル
- `client/src/api/core/request.ts`
  - `form-data` インポートの削除（ブラウザ環境対応）
  - `formData?.getHeaders()` の修正

### 2. カスタムフック

#### 新規ファイル
- `client/src/hooks/useBookDetail.ts`
  - 書籍詳細データ取得用のReact Queryフック
  - bookIdが存在する場合のみAPIを呼び出し

```typescript
export const useBookDetail = (bookId: string | undefined) => {
    return useQuery({
        queryKey: ['bookDetail', bookId],
        queryFn: () => BooksService.getBooks(bookId!),
        enabled: !!bookId,
    });
};
```

### 3. 詳細画面の更新

#### 変更ファイル
- `client/src/pages/BookDetail.tsx`

**主な変更点:**
1. モックデータ（`bookDetailsData`）の削除
2. `useBookDetail`フックを使用してAPIからデータ取得
3. ローディング状態の表示
4. エラーハンドリング
5. APIレスポンスのフィールド名にマッピング

**フィールドマッピング:**
| モックデータ | APIレスポンス |
|-------------|--------------|
| publishDate | publishedDate |
| description | overview |
| summary | aboutThisBook（配列） |
| qiitaHighlights | trendingPoints |
| amazonRating | amazonReviewSummary.averageRating |
| amazonReviewCount | amazonReviewSummary.totalReviews |
| amazonReviews | featuredReviews |
| amazonUrl | purchaseLinks.amazon |
| rakutenUrl | purchaseLinks.rakuten |
| images | bookImage（単一画像） |

### 4. ページ遷移の実装

#### 変更ファイル
- `client/src/components/BookCard.tsx`
  - `id`の型を`number`から`string`に変更
  - `window.location.href`から`wouter`の`Link`に変更
  - 書籍画像・タイトルクリックで詳細ページへ遷移

- `client/src/pages/Home.tsx`
  - `book.id`を`book.bookId`に変更

### 5. 共通レイアウト

#### 新規ファイル
- `client/src/components/Layout.tsx`
  - 共通ヘッダー（ロゴ、ナビゲーション）
  - 共通フッター
  - ロゴクリックでホームに遷移

#### 変更ファイル
- `client/src/pages/Home.tsx`
  - ヘッダー・フッターを削除
  - `Layout`コンポーネントでラップ

- `client/src/pages/BookDetail.tsx`
  - 独自ヘッダーを削除
  - `Layout`コンポーネントでラップ

## 画像表示

### 実装方法
```tsx
const bookImage = book.bookImage || noImage;

<img
  src={bookImage}
  alt={book.title ?? "書籍画像"}
  onError={(e) => {
    e.currentTarget.src = noImage;
  }}
/>
```

- APIから`bookImage`を取得
- 画像URLが空の場合は`no-image.svg`を表示
- 画像読み込みエラー時も`no-image.svg`にフォールバック

## エラーハンドリング

### 表示パターン

1. **ローディング中**: スピナー + 「読み込み中...」
2. **エラー発生時**: 「書籍の取得に失敗しました」
3. **書籍が見つからない**: 「書籍が見つかりません」
4. **画像読み込み失敗**: NoImage SVGを表示

## ルーティング

### URL構造
- 詳細画面: `/book/:id`
- パラメータ`id`はbookId（ISBN形式の文字列）

## 検証項目

- [ ] 詳細画面が正しく表示される
- [ ] TOPページのランキングから詳細画面に遷移できる
- [ ] TOPページのトレンドカードから詳細画面に遷移できる
- [ ] ローディング中にスピナーが表示される
- [ ] 存在しないbookIdでエラーメッセージが表示される
- [ ] 画像が取得できない場合にNoImage画像が表示される
- [ ] 共通ヘッダーが全ページで表示される
- [ ] ロゴクリックでホームに戻れる

## 今後の課題

- 関連書籍の表示機能
- レビュー投稿機能
- お気に入り登録機能
- SNSシェア機能

