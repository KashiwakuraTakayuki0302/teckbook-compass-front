# 環境変数設定ガイド

## 概要

このプロジェクトでは、開発環境と本番環境で異なる環境変数を使用します。Viteの環境別設定ファイル機能を活用しています。

## 環境変数ファイル

### `.env.example`
開発環境用のテンプレートファイル。初回セットアップ時にこれをコピーして`.env`を作成します。

```bash
cp .env.example .env
```

### `.env` (gitignore対象)
ローカル開発環境用の設定ファイル。個人の開発環境に合わせてカスタマイズできます。

### `.env.production`
本番環境用の設定ファイル。`npm run build`実行時に自動的に読み込まれます。

**設定内容:**
```bash
NODE_ENV=production
VITE_API_URL=https://api.teck-book-compass.com/
```

## 使用方法

### 開発環境で実行

```bash
# .envまたは.env.developmentが使用されます
pnpm dev
```

### 本番ビルド

```bash
# .env.productionが自動的に使用されます
pnpm build
```

### Dockerビルド

#### 方法1: .env.productionファイルを使用 (デフォルト)

```bash
docker build -t teckbook-compass-front .
```

`.env.production`ファイルの内容が自動的に使用されます。

#### 方法2: ビルド引数で環境変数を上書き

```bash
docker build \
  --build-arg VITE_API_URL=https://api.custom-domain.com/ \
  --build-arg VITE_APP_ID=custom-app-id \
  -t teckbook-compass-front .
```

ビルド引数を指定すると、`.env.production`の内容が上書きされます。

## 環境変数の優先順位

Viteは以下の優先順位で環境変数を読み込みます（上が優先）:

1. シェルの環境変数
2. `.env.[mode].local` (例: `.env.production.local`)
3. `.env.[mode]` (例: `.env.production`)
4. `.env.local`
5. `.env`

## 注意事項

### VITE_プレフィックス

クライアント側で使用する環境変数には必ず`VITE_`プレフィックスを付けてください。これがないと、Viteがビルド時に変数を埋め込みません。

**正しい例:**
```bash
VITE_API_URL=https://api.example.com/
```

**間違った例:**
```bash
API_URL=https://api.example.com/  # クライアント側で使用できません
```

### セキュリティ

- `.env`ファイルは`.gitignore`に含まれており、Gitにコミットされません
- `.env.production`は本番環境の設定を含むため、機密情報を含む場合はコミットしないでください
- 機密情報が必要な場合は、Dockerビルド引数やCI/CDの環境変数を使用してください

## トラブルシューティング

### 環境変数が反映されない

1. 変数名に`VITE_`プレフィックスがあるか確認
2. 開発サーバーを再起動（環境変数の変更後は必須）
3. ビルドをクリーンしてから再ビルド

```bash
rm -rf dist
pnpm build
```

### Dockerビルドで環境変数が反映されない

1. `.env.production`ファイルが存在するか確認
2. Dockerビルド引数を使用する場合は、すべての必要な変数を指定
3. Dockerのキャッシュをクリア

```bash
docker build --no-cache -t teckbook-compass-front .
```
