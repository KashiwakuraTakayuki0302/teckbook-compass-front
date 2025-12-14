# teckbook-compass-front

## ローカル環境構築

### 前提条件
- Node.js (v20以上推奨)
- pnpm

### セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd teckbook-compass-front
   ```

2. **依存関係のインストール**
   ```bash
   pnpm install
   ```

3. **環境変数の設定**
   `.env.example` をコピーして `.env` ファイルを作成し、必要な値を設定してください。
   ```bash
   cp .env.example .env
   ```

4. **開発サーバーの起動**
   ```bash
   pnpm dev
   ```
   ブラウザで `http://localhost:3000` (または表示されたポート) にアクセスしてください。

## OpenAPI API クライアント生成

このプロジェクトは Go バックエンドの OpenAPI 仕様から API クライアントを自動生成します。

### セットアップ

1. **Go バックエンドを起動**
   ```bash
   # 別のターミナルで Go バックエンドを起動
   # http://localhost:8080 で起動していることを確認
   ```

2. **API クライアントを生成**
   ```bash
   pnpm generate:api
   ```

3. **フロントエンドを起動**
   ```bash
   pnpm dev
   ```

詳細なセットアップ手順は [OPENAPI_SETUP.md](./OPENAPI_SETUP.md) を参照してください。

### その他コマンド
- `pnpm build`: 本番用ビルド
- `pnpm start`: 本番サーバー起動
- `pnpm check`: TypeScript型チェック
- `pnpm format`: コードフォーマット
- `pnpm test`: テスト実行
- `pnpm generate:api`: API クライアント生成 (Go バックエンド起動が必要)