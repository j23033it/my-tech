# My Tech Guide

個人用の技術解説サイトです。Astro と Markdown/MDX を前提に、Web基礎、プログラミング言語、AI、開発ツールなどの記事をカテゴリ別に整理します。

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

生成物は `dist/` に出力されます。

## Cloudflare Pages

Cloudflare Pages では以下の設定を使います。

- Build command: `npm run build`
- Build output directory: `dist`
- Framework preset: `Astro`

## GitHub Pages の公開停止

このリポジトリ内には、GitHub Pages 用の `.github` ワークフロー、`CNAME`、`.nojekyll` はありません。

GitHub Pages の公開停止はローカルファイルだけでは完了できないため、GitHub のリポジトリ設定から行います。

1. GitHub のリポジトリを開く
2. `Settings` → `Pages` を開く
3. `Build and deployment` の公開元を無効化、または `None` に変更する
4. Cloudflare Pages 側で GitHub リポジトリを接続し、`main` ブランチからデプロイする
