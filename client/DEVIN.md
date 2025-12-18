# Devin Guide – Frontend (React / Vite)

このドキュメントは、Devin が **本リポジトリのフロントエンド開発を行う際の必須ガイドライン**です。
すべての作業は本ガイドに従ってください。

---

## 1. 技術スタック

### 基本構成

* Framework: React
* Language: TypeScript
* Build Tool: Vite
* Package Manager: pnpm

---

## 2. 状態管理ルール

### サーバー状態

* 使用ライブラリ: `@tanstack/react-query`
* API 通信・キャッシュ管理は **必ず react-query 経由**
* `useQuery / useMutation` を適切に使い分けること

### クライアント状態

* React 標準のみ使用可

  * `useState`
  * `useReducer`
  * `Context API`
* **外部状態管理ライブラリは禁止**

### フォーム管理

* React の Controlled Components を使用
* Form ライブラリ（React Hook Form 等）は使用禁止

---

## 3. API 通信・型定義ルール（最重要）

### 通信手段

* HTTP Client: `axios`
* クエリ管理: `@tanstack/react-query`
* RPC: `@trpc/client`, `@trpc/react-query`

### 型生成

* OpenAPI 由来の型は
  `openapi-typescript-codegen` により生成されたものを使用
* **手書きで API レスポンス型を定義しない**

### API 実装時の注意

* 新しい API を使用する場合：

  * 既存の `api/` 配下構成を踏襲
  * react-query 用 hooks を `hooks/` に作成
* エラーハンドリングは既存実装に必ず合わせること

---

## 4. UI / デザインルール

### スタイリング

* CSS は **Tailwind CSS のみ使用可**
* インラインスタイルや独自 CSS の追加は禁止（既存を除く）

### コンポーネント方針

* UI コンポーネントは **すべて自作**
* 外部 UI ライブラリ（MUI / Chakra 等）は使用禁止

### デザインについて

* デザインガイドは存在しない
* 別システムで作成された **デザインキャプチャを正とする**
* 新規画面作成は許可されているが：

  * 指示されたデザインキャプチャに忠実に実装すること
  * **独自判断でのデザイン変更は禁止**

---

## 5. ディレクトリ構成ルール

```
client/
└── src/
    ├── api/
    ├── components/
    ├── contexts/
    ├── data/
    ├── hooks/
    ├── lib/
    ├── pages/
    ├── _core/
    ├── App.tsx
    └── main.tsx
```

### ルール

* ページ固有ロジックは `pages/`
* 再利用可能ロジックは `hooks/` または `components/`
* `_core/` 配下は **慎重に扱い、勝手に設計変更しない**

---

## 6. テスト方針

* 現時点でテストは未整備
* 将来的に `vitest` を導入予定

### Devin の対応方針

* テスト追加は **明示的な指示があった場合のみ**
* 勝手にテストフレームワークを導入しない

---

## 7. Lint / Formatter

* ESLint は導入予定
* Prettier は未導入

### ルール

* 新たな Lint / Formatter を **独断で追加しない**
* コードスタイルは既存コードに合わせること

---

## 8. 実行コマンド

```bash
pnpm install
pnpm dev
pnpm build
```

---

## 9. Git / ブランチ運用ルール（重要）

* ❌ **main ブランチへの直接 push は禁止**
* すべての作業は以下の流れで行うこと：

### 作業フロー

1. main から作業ブランチを作成
2. 作業ブランチで実装
3. Pull Request を作成
4. 人間によるレビュー後にマージ

* Devin は **PR 作成まで**を担当し、
  **マージは行わない**

---

## 10. 禁止事項（厳守）

以下は **明示的な指示がない限り絶対に行わないこと**

* ❌ main ブランチへの直接 push
* ❌ 新しいライブラリの追加
* ❌ 指示されていないデザイン変更
* ❌ 大規模リファクタリング
* ❌ ディレクトリ構成の再設計

---

## 11. 作業スタンス

* 小さく、明確に、指示された範囲のみ変更する
* 不明点がある場合は推測せず、作業を止める
* PR には必ず変更内容の要約を書くこと
