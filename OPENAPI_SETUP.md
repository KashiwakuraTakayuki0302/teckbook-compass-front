# OpenAPI API クライアント生成セットアップ

## 📋 概要

このドキュメントでは、Go バックエンドの OpenAPI 仕様から React フロントエンド用の API クライアントを自動生成する手順を説明します。

## 🏗️ アーキテクチャ

```
┌─────────────────────┐         ┌─────────────────────┐
│  Go Backend         │         │  React Frontend     │
│  localhost:8080     │◄────────┤  localhost:3000     │
│                     │  HTTP   │                     │
│  /api/openapi.yaml  │         │  Generated Client   │
└─────────────────────┘         └─────────────────────┘
         │                               ▲
         │                               │
         └───────────────────────────────┘
              openapi-typescript-codegen
```

## 📁 ディレクトリ構造

```
teckbook-compass-front/
├── package.json                    # generate:api スクリプト追加済み
├── .env                           # VITE_API_URL 設定済み
├── .env.example                   # VITE_API_URL 設定例
├── .gitignore                     # /client/src/api を除外
└── client/
    └── src/
        ├── api/                   # 🔄 自動生成 (Git 管理外)
        │   ├── index.ts
        │   ├── core/
        │   ├── models/
        │   └── services/
        ├── lib/
        │   └── apiClient.ts       # API クライアント設定
        ├── hooks/
        │   └── useUsers.ts        # サンプル API フック
        └── pages/
            └── UsersPage.tsx      # サンプルページ
```

## 🚀 セットアップ手順

### 1. 前提条件の確認

- ✅ Go バックエンドが `http://localhost:8080` で起動している
- ✅ OpenAPI 仕様が `http://localhost:8080/api/openapi.yaml` でアクセス可能
- ✅ Node.js と pnpm がインストール済み

### 2. 依存関係のインストール (完了済み)

```bash
pnpm install
```

すでに `openapi-typescript-codegen` がインストールされています。

### 3. 環境変数の設定 (完了済み)

`.env` ファイルに以下が設定されています:

```env
VITE_API_URL="http://localhost:8080"
```

### 4. API クライアントの生成

**重要**: Go バックエンドを起動してから実行してください。

```bash
pnpm generate:api
```

このコマンドは以下を実行します:
- `http://localhost:8080/api/openapi.yaml` から OpenAPI 仕様を取得
- `client/src/api/` ディレクトリに TypeScript コードを生成
- axios ベースの API クライアントを作成

### 5. 生成されたファイルの確認

```bash
ls -la client/src/api/
```

以下のようなファイルが生成されます:
- `index.ts` - エクスポート
- `core/` - コアロジック
- `models/` - TypeScript 型定義
- `services/` - API サービスクラス (例: `CategoriesService.ts`)

## 💻 使用方法

### 基本的な使い方

#### 1. API クライアントの初期化

`client/src/lib/apiClient.ts` で設定済み:

```typescript
import { OpenAPI } from '@/api';

OpenAPI.BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

#### 2. React Query と組み合わせる

`client/src/hooks/useCategories.ts` のサンプルを参照:

```typescript
import { useQuery } from '@tanstack/react-query';
import { CategoriesService } from '@/api';

export const useCategoriesWithBooks = () => {
  return useQuery({
    queryKey: ['categories', 'with-books'],
    queryFn: () => CategoriesService.getCategoriesWithBooks(),
  });
};
```

#### 3. コンポーネントで使用

`client/src/pages/CategoriesPage.tsx` のサンプルを参照:

```typescript
import { useCategoriesWithBooks } from '@/hooks/useCategories';

export default function CategoriesPage() {
  const { data, isLoading, error } = useCategoriesWithBooks();
  
  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;
  
  return <div>{/* データを表示 */}</div>;
}
```

## 🔄 開発ワークフロー

### OpenAPI 仕様が更新された場合

1. Go バックエンドで OpenAPI 仕様を更新
2. フロントエンドで再生成:
   ```bash
   pnpm generate:api
   ```
3. TypeScript の型チェック:
   ```bash
   pnpm check
   ```

### 推奨ワークフロー

```bash
# 1. バックエンドを起動
cd /path/to/go-backend
go run main.go

# 2. 別のターミナルでフロントエンドのセットアップ
cd /path/to/teckbook-compass-front

# 3. API クライアントを生成
pnpm generate:api

# 4. フロントエンドを起動
pnpm dev
```

## 🧪 動作確認

### 1. サンプルページへのアクセス

開発サーバー起動後、以下にアクセス:

```
http://localhost:3000/users
```

### 2. ネットワークタブで確認

ブラウザの開発者ツールで:
- Network タブを開く
- `http://localhost:8080/api/users` へのリクエストを確認
- レスポンスデータを確認

### 3. エラーが発生した場合

#### バックエンドが起動していない
```
Error: Failed to fetch users
```
→ Go バックエンドを起動してください

#### CORS エラー
```
Access to fetch at 'http://localhost:8080' from origin 'http://localhost:3000' has been blocked by CORS policy
```
→ Go バックエンドで CORS 設定を確認してください

#### API クライアントが生成されていない
```
Module '@/api' not found
```
→ `pnpm generate:api` を実行してください

## 📝 カスタマイズ

### 生成オプションの変更

`package.json` の `generate:api` スクリプトを編集:

```json
{
  "scripts": {
    "generate:api": "openapi-typescript-codegen --input http://localhost:8080/api/openapi.yaml --output ./client/src/api --client axios --useOptions --useUnionTypes"
  }
}
```

利用可能なオプション:
- `--client axios|fetch|xhr` - HTTP クライアントの選択
- `--useOptions` - オプションパラメータを使用
- `--useUnionTypes` - Union 型を使用
- `--exportCore true|false` - コアファイルをエクスポート
- `--exportServices true|false` - サービスをエクスポート
- `--exportModels true|false` - モデルをエクスポート

### ローカルファイルから生成

バックエンドが起動していない場合、ローカルファイルから生成:

```json
{
  "scripts": {
    "generate:api": "openapi-typescript-codegen --input ./openapi.yaml --output ./client/src/api --client axios"
  }
}
```

## 🔧 トラブルシューティング

### 問題: 生成されたコードに型エラーがある

**解決策**:
1. OpenAPI 仕様が正しいか確認
2. 最新版の `openapi-typescript-codegen` を使用
   ```bash
   pnpm update openapi-typescript-codegen
   ```

### 問題: 環境変数が読み込まれない

**解決策**:
1. `.env` ファイルが存在するか確認
2. 変数名が `VITE_` で始まっているか確認
3. 開発サーバーを再起動

### 問題: 生成されたコードが Git にコミットされる

**解決策**:
`.gitignore` に以下が含まれているか確認:
```
/client/src/api
```

## 📚 参考リンク

- [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)
- [OpenAPI Specification](https://swagger.io/specification/)
- [React Query](https://tanstack.com/query/latest)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## 🎯 次のステップ

1. ✅ セットアップ完了
2. 🔄 Go バックエンドを起動
3. 🔄 `pnpm generate:api` を実行
4. 🔄 実際の API エンドポイントに合わせて `useUsers.ts` を更新
5. 🔄 `UsersPage.tsx` をカスタマイズ
6. 🔄 他の API エンドポイント用のフックを作成
