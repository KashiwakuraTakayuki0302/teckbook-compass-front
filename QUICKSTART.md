# 🚀 OpenAPI API クライアント生成 - クイックスタート

## 前提条件

- ✅ Go バックエンドが別リポジトリにある
- ✅ Go バックエンドは `http://localhost:8080` で起動
- ✅ OpenAPI 仕様は `http://localhost:8080/api/openapi.yaml` でアクセス可能

## セットアップ完了済み ✅

以下のセットアップは既に完了しています:

- [x] `openapi-typescript-codegen` インストール済み
- [x] `pnpm generate:api` スクリプト追加済み
- [x] 環境変数 `VITE_API_URL` 設定済み
- [x] API クライアント設定ファイル作成済み
- [x] サンプルフック・ページ作成済み

## 今すぐ実行できるコマンド

### 1️⃣ Go バックエンドを起動

```bash
# 別のターミナルで Go バックエンドのディレクトリに移動
cd /path/to/your/go-backend

# バックエンドを起動
go run main.go

# または
make run

# 起動確認
curl http://localhost:8080/api/openapi.yaml
```

### 2️⃣ API クライアントを生成

```bash
# このプロジェクトのディレクトリで
pnpm generate:api
```

**成功すると**:
```
✔ Generating client...
✔ Writing to disk...
✔ Done!
```

**生成されるファイル**:
```
client/src/api/
├── index.ts
├── core/
├── models/
└── services/
```

### 3️⃣ TypeScript 型チェック

```bash
pnpm check
```

### 4️⃣ フロントエンド起動

```bash
pnpm dev
```

### 5️⃣ サンプルページにアクセス

ブラウザで以下にアクセス:
```
http://localhost:3000/users
```

## トラブルシューティング

### ❌ エラー: Connection refused

```
Failed to fetch document content at http://localhost:8080/api/openapi.yaml
```

**解決策**: Go バックエンドが起動していません。ステップ 1 を実行してください。

### ❌ エラー: Module '@/api' not found

```
Cannot find module '@/api'
```

**解決策**: API クライアントが生成されていません。ステップ 2 を実行してください。

### ❌ エラー: CORS policy

```
Access to fetch at 'http://localhost:8080' has been blocked by CORS policy
```

**解決策**: Go バックエンドで CORS を設定してください:

```go
// Go バックエンドの例
import "github.com/rs/cors"

handler := cors.New(cors.Options{
    AllowedOrigins: []string{"http://localhost:3000"},
    AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders: []string{"*"},
}).Handler(yourHandler)
```

## 次のステップ

1. **サンプルフックを確認**
   
   [client/src/hooks/useCategories.ts](file:///Users/kashiwakura/develop/teckbook-compass-front/client/src/hooks/useCategories.ts) を開いて、生成されたサービスの使用方法を確認:

   ```typescript
   import { CategoriesService } from '@/api';
   
   export const useCategoriesWithBooks = () => {
     return useQuery({
       queryKey: ['categories', 'with-books'],
       queryFn: () => CategoriesService.getCategoriesWithBooks(),
     });
   };
   ```

2. **他の API エンドポイント用のフックを作成**

   OpenAPI 仕様に基づいて、必要なフックを作成:
   - `useRankings.ts` - ランキング取得
   - など

3. **既存ページを更新**

   現在の tRPC ベースのページを、新しい OpenAPI クライアントを使用するように段階的に移行

## 詳細ドキュメント

- 📖 [OPENAPI_SETUP.md](./OPENAPI_SETUP.md) - 詳細なセットアップガイド
- 📝 [Walkthrough](file:///Users/kashiwakura/.gemini/antigravity/brain/6350fe7c-2535-4597-9dc9-5b9d39a4ef3f/walkthrough.md) - 実装内容の詳細

## 便利なコマンド

```bash
# API クライアント再生成 (仕様更新時)
pnpm generate:api

# TypeScript 型チェック
pnpm check

# コードフォーマット
pnpm format

# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build
```

## 開発ワークフロー

```
1. Go バックエンドで OpenAPI 仕様を更新
   ↓
2. pnpm generate:api で再生成
   ↓
3. TypeScript エラーを確認・修正
   ↓
4. pnpm dev で動作確認
   ↓
5. コミット
```

---

**質問がある場合は、[OPENAPI_SETUP.md](./OPENAPI_SETUP.md) のトラブルシューティングセクションを参照してください。**
