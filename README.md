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

4. **データベースのセットアップ**
   ```bash
   pnpm db:push
   ```

5. **開発サーバーの起動**
   ```bash
   pnpm dev
   ```
   ブラウザで `http://localhost:3000` (または表示されたポート) にアクセスしてください。

### その他コマンド
- `pnpm build`: 本番用ビルド
- `pnpm start`: 本番サーバー起動
- `pnpm check`: TypeScript型チェック
- `pnpm format`: コードフォーマット
- `pnpm test`: テスト実行