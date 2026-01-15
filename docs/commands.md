# pnpm コマンド一覧

このドキュメントでは、`package.json` に定義されている各種コマンド（scripts）について解説します。
開発時は `pnpm <コマンド名>` の形式で実行してください。

## 開発・実行

### `pnpm dev`
- **コマンド**: `NODE_ENV=development tsx watch server/_core/index.ts`
- **概要**: 開発サーバーを起動します。
- **詳細**: バックエンド（BFF）とフロントエンド（Vite Middleware）を開発モードで立ち上げます。ファイルの変更を検知して自動的に再起動・ホットリロードが行われます。

### `pnpm build`
- **コマンド**: `vite build`
- **概要**: 本番用ビルドを実行します。
- **詳細**: フロントエンドのリソースを最適化し、`dist` ディレクトリに出力します。

### `pnpm start`
- **コマンド**: `NODE_ENV=production node dist/index.js`
- **概要**: 本番サーバーを起動します。
- **詳細**: `pnpm build` で生成された `dist` ディレクトリ内のファイルを使用して、プロダクションモードでサーバーを稼働させます。

## コード品質・テスト

### `pnpm check`
- **コマンド**: `tsc --noEmit`
- **概要**: TypeScript の型チェックを実行します。
- **詳細**: コンパイルエラーの有無を確認します。ファイルの出力は行いません（`--noEmit`）。CI/CD パイプラインなどでコードの整合性を保つために使用します。

### `pnpm format`
- **コマンド**: `prettier --write .`
- **概要**: コードフォーマットを実行します。
- **詳細**: プロジェクト全体のファイルを Prettier の設定に従って整形します。

### `pnpm test`
- **コマンド**: `vitest run`
- **概要**: ユニットテストを実行します。
- **詳細**: Vitest を使用してテストを一回実行します。

## その他

### `pnpm generate:api`
- **コマンド**: `openapi --input http://localhost:8080/api/openapi.yaml --output ./client/src/api --client axios`
- **概要**: API クライアントコードを自動生成します。
- **詳細**: Go バックエンドサーバー（`http://localhost:8080`）が提供する `openapi.yaml` を読み込み、`client/src/api` ディレクトリに TypeScript の型定義と API クライアントコード（Axios ベース）を生成します。実行にはバックエンドサーバーが起動している必要があります。
