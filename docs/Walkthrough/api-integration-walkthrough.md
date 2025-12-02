# OpenAPI API クライアント生成セットアップ - Walkthrough

## 📝 概要

Go バックエンドの OpenAPI 仕様から React フロントエンド用の API クライアントを自動生成する環境を構築しました。

## 🎯 実装内容

### 1. 依存関係のインストール

`openapi-typescript-codegen` をインストールしました:

```bash
pnpm add -D openapi-typescript-codegen
```

このツールは OpenAPI 仕様から TypeScript の型定義と API クライアントコードを自動生成します。

---

### 2. API クライアント生成スクリプトの追加

[package.json](../package.json) に `generate:api` スクリプトを追加:

```json
{
  "scripts": {
    "generate:api": "openapi --input http://localhost:8080/api/openapi.yaml --output ./client/src/api --client axios"
  }
}
```

**注意点**:
- パッケージ名は `openapi-typescript-codegen` ですが、インストールされるバイナリコマンド名は `openapi` です。
- 当初 `openapi-typescript-codegen` コマンドを使用していましたが、`openapi` に修正しました。

---

### 3. 環境変数の設定

#### [.env.example](../.env.example)

```env
# API Configuration
VITE_API_URL="http://localhost:8080"
```

#### .env

実際の `.env` ファイルにも同じ設定を追加しました。

**用途**: フロントエンドから Go バックエンドへの API リクエスト時のベース URL として使用します。

---

### 4. API クライアント設定ファイル

#### [client/src/lib/apiClient.ts](../client/src/lib/apiClient.ts)

```typescript
import { OpenAPI } from '@/api';

OpenAPI.BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
OpenAPI.WITH_CREDENTIALS = false;
```

---

### 5. API クライアントの生成と検証

Go バックエンド (`localhost:8080`) が起動している状態でスクリプトを実行し、正常に生成されました。

```bash
pnpm generate:api
```

**生成されたサービス**:
- `CategoriesService`
- `RankingsService`
- `SystemService`

**検証**:
`CategoriesService` を使用したサンプルフックとページを作成し、動作を確認しました (確認後、クリーンアップのために削除済み)。

---

### 6. Git 設定の更新

#### [.gitignore](../.gitignore)

```gitignore
# generated API client
/client/src/api
```

---

### 7. ドキュメント作成

- [OPENAPI_SETUP.md](../OPENAPI_SETUP.md): 詳細なセットアップガイド
- [QUICKSTART.md](../QUICKSTART.md): クイックスタートガイド
- [README.md](../README.md): 概要の追記

---

## トラブルシューティングの記録

実装中に以下の問題に遭遇し、解決しました:

1. **コマンド名のエラー**:
   - エラー: `command not found: openapi-typescript-codegen`
   - 原因: パッケージのバイナリ名が `openapi` だった
   - 解決: スクリプトを `openapi ...` に修正

2. **OpenAPI 仕様が見つからない**:
   - エラー: `HTTP ERROR 404` at `http://localhost:8080/api/openapi.yaml`
   - 原因: バックエンドの設定でパスが異なっていた、または起動していなかった
   - 解決: バックエンドの設定を確認・修正し、アクセス可能になったことを確認

---

## 📊 実装サマリー

| 項目 | 状態 | 備考 |
|------|------|------|
| 依存関係インストール | ✅ 完了 | `openapi-typescript-codegen` |
| 生成スクリプト | ✅ 完了 | `openapi` コマンドを使用 |
| 環境変数設定 | ✅ 完了 | `VITE_API_URL` |
| API クライアント設定 | ✅ 完了 | `apiClient.ts` |
| API クライアント生成 | ✅ 完了 | `client/src/api/` に生成済み |
| ドキュメント | ✅ 完了 | セットアップガイド作成済み |

---

## 🚀 次のステップ

1. **実際の機能実装**:
   - 生成された `CategoriesService` や `RankingsService` を使用して、既存のコンポーネントを更新する
   - 新しい機能開発に生成されたクライアントを使用する

2. **継続的な更新**:
   - バックエンドの API 仕様変更に合わせて `pnpm generate:api` を実行する運用を定着させる
