# トラブルシューティング

このファイルは、開発中に起きた不具合と再発防止のための確認ポイントを残すメモです。

## MDX記事カードをクリックするとトップページへ戻る

### 発生日

2026-05-19

### 症状

Python演習記事をMDXで追加したあと、トップページ、記事一覧ページ、カテゴリページの記事カードをクリックすると、対象の記事ではなくトップページへ戻ったように見える状態になった。

対象になった記事の例:

- `/articles/languages/python-functions-basics-practice/`
- `/articles/languages/python-data-structures-practice/`
- `/articles/languages/python-modules-packages-libraries-practice/`

### 原因

記事カードのリンク生成処理が、Markdown記事だけを前提にしていた。

```astro
article.id.replace(/\.md$/, "")
```

この処理では `.md` は取り除けるが、`.mdx` は取り除けない。そのため、MDX記事へのリンクが次のように生成されていた。

```text
/articles/languages/python-functions-basics-practice.mdx/
```

一方、記事詳細ページの静的ルートは `.mdx` を除いたパスで生成していたため、正しいURLは次の形だった。

```text
/articles/languages/python-functions-basics-practice/
```

リンク先と生成済みページのパスがずれたことで、存在しない記事URLへ遷移し、結果としてトップページへ戻ったように見えていた。

### 修正内容

`.md` と `.mdx` の両方を取り除くように、記事カード側のリンク生成を修正した。

```astro
article.id.replace(/\.(md|mdx)$/, "")
```

修正したファイル:

- `src/pages/index.astro`
- `src/pages/articles/index.astro`
- `src/pages/categories/[slug].astro`

記事詳細ページ側も同じ考え方で、`.md` / `.mdx` の両方を除去してルートを生成する。

```astro
params: { slug: article.id.replace(/\.(md|mdx)$/, "") }
```

該当ファイル:

- `src/pages/articles/[...slug].astro`

### 再発防止

Markdown記事とMDX記事を混在させる場合、`article.id` からURLを作る箇所では必ず `.md` と `.mdx` の両方を扱う。

新しく記事一覧や関連記事リンクを作るときは、次の観点で確認する。

1. `.mdx` がURLに残っていないか
2. `npm run build` で生成されるパスと、画面上のリンク先が一致しているか
3. トップページ、記事一覧、カテゴリページの各カードから実際に記事へ遷移できるか

### 確認コマンド

```bash
npm run build
```

ビルドログで、MDX記事が次のように `.mdx` なしのパスで生成されていれば正常。

```text
/articles/languages/python-functions-basics-practice/index.html
/articles/languages/python-data-structures-practice/index.html
/articles/languages/python-modules-packages-libraries-practice/index.html
```
