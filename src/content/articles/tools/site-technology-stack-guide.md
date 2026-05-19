---
title: "このサイトを構成している技術の全体像"
description: "My Tech Guide が Astro、Markdown/MDX、Content Collections、Pagefind、Mermaid、Cloudflare Pages でどう作られているかを整理する入門ガイド。"
category: "開発ツール"
categorySlug: "tools"
tags: ["Astro", "Markdown", "MDX", "Pagefind", "Mermaid", "Cloudflare Pages", "GitHub"]
level: "beginner"
updated: "2026-05-19"
draft: false
---

<p class="lead">このサイトは、記事を増やし続けることを優先した静的な技術解説サイトです。Astroでページを生成し、Markdown/MDXで記事を書き、Content Collectionsで記事情報を管理し、Pagefindで検索し、Mermaidで図解を入れ、Cloudflare Pagesで公開する構成になっています。</p>

<section id="overview" data-search-section>
<h2>1. まず全体像を見る</h2>
<p class="lead">このサイトの技術は、「書く」「組み立てる」「探す」「図解する」「公開する」の5つに分けると理解しやすいです。</p>

<div class="diagram">
<pre class="mermaid">
flowchart LR
  W["記事を書く\nMarkdown / MDX"] --> C["記事を管理する\nAstro Content Collections"]
  C --> A["ページを生成する\nAstro"]
  A --> H["静的HTML/CSS/JS\n dist/"]
  H --> P["検索インデックスを作る\nPagefind"]
  H --> D["公開する\nCloudflare Pages"]
  G["変更履歴を残す\nGit / GitHub"] --> D
  M["図解を書く\nMermaid"] --> W
</pre>
</div>

<table>
<thead>
<tr><th>役割</th><th>使っている技術</th><th>このサイトでの意味</th></tr>
</thead>
<tbody>
<tr><td>サイト生成</td><td>Astro</td><td>記事一覧、カテゴリページ、記事ページを静的HTMLとして作る</td></tr>
<tr><td>記事本文</td><td>Markdown / MDX</td><td>文章中心で記事を書き、必要なときだけコンポーネントも使う</td></tr>
<tr><td>記事管理</td><td>Astro Content Collections</td><td>frontmatterの形をそろえ、記事データをページ側から扱いやすくする</td></tr>
<tr><td>検索</td><td>Pagefind</td><td>ビルド済みHTMLから検索用インデックスを作る</td></tr>
<tr><td>図解</td><td>Mermaid</td><td>テキストでフローチャートや関係図を書く</td></tr>
<tr><td>公開</td><td>Cloudflare Pages</td><td><code>dist/</code> に生成された静的ファイルを配信する</td></tr>
<tr><td>変更管理</td><td>Git / GitHub</td><td>記事とコードの変更履歴を残し、デプロイ連携の入口にする</td></tr>
</tbody>
</table>

<div class="note">
<strong>最初の理解:</strong> このサイトは、サーバーで毎回ページを組み立てるアプリではありません。手元やCIで先にHTMLを作り、その完成品をCloudflare Pagesから配る「静的サイト」です。
</div>
</section>

<section id="astro" data-search-section>
<h2>2. Astroはサイトを組み立てる道具</h2>
<p class="lead">Astroは、Markdown中心のコンテンツサイトを作りやすい静的サイトジェネレーターです。</p>

<p>このサイトでは、<code>src/pages/</code> に置いたAstroファイルがURLになります。たとえばトップページは <code>src/pages/index.astro</code>、記事一覧は <code>src/pages/articles/index.astro</code>、記事ページは <code>src/pages/articles/[...slug].astro</code> が担当します。</p>

<table>
<thead>
<tr><th>ファイル</th><th>担当</th></tr>
</thead>
<tbody>
<tr><td><code>astro.config.mjs</code></td><td>Astro全体の設定。サイトURL、静的出力、MDX連携などを指定する</td></tr>
<tr><td><code>src/pages/index.astro</code></td><td>トップページ。カテゴリ一覧や最新記事を表示する</td></tr>
<tr><td><code>src/pages/articles/[...slug].astro</code></td><td>記事詳細ページ。記事本文と目次を表示する</td></tr>
<tr><td><code>src/layouts/BaseLayout.astro</code></td><td>全ページ共通のHTML骨格やメタ情報を持つ</td></tr>
<tr><td><code>src/styles/global.css</code></td><td>サイト全体の見た目を管理する</td></tr>
</tbody>
</table>

<p>設定ファイルでは、現在このように静的サイトとして出力する指定になっています。</p>

<pre><code class="language-js">import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://my-tech.pages.dev",
  output: "static",
  integrations: [mdx()]
});</code></pre>

<div class="note">
<strong>ポイント:</strong> <code>output: "static"</code> なので、ビルド時にページを作って <code>dist/</code> へ出します。ログイン機能やリアルタイム更新が中心ではなく、読み物を高速に配るサイトと相性がよい構成です。
</div>
</section>

<section id="markdown-mdx" data-search-section>
<h2>3. MarkdownとMDXは記事を書くための形式</h2>
<p class="lead">記事本文は、基本的にMarkdownまたはMDXで書きます。文章を主役にできるので、技術ノートを増やしやすい形式です。</p>

<p>Markdownは、見出し、段落、リスト、表、コードブロックなどを軽い記法で書ける形式です。MDXはMarkdownに加えて、AstroコンポーネントやJSXに近い表現を使える形式です。</p>

<table>
<thead>
<tr><th>形式</th><th>向いている記事</th><th>このサイトでの使い分け</th></tr>
</thead>
<tbody>
<tr><td><code>.md</code></td><td>文章、表、コード例が中心の記事</td><td>通常の解説記事に使う</td></tr>
<tr><td><code>.mdx</code></td><td>本文中に部品や動くUIを入れたい記事</td><td>練習問題の答え表示など、コンポーネントが必要な記事に使う</td></tr>
</tbody>
</table>

<p>記事の先頭にはfrontmatterを書きます。これは記事のタイトル、説明、カテゴリ、タグ、更新日などをページ側で使うためのメタ情報です。</p>

<pre><code class="language-yaml">---
title: "記事タイトル"
description: "記事の説明"
category: "開発ツール"
categorySlug: "tools"
tags: ["Astro", "Markdown"]
level: "beginner"
updated: "2026-05-19"
draft: false
---</code></pre>

<div class="note">
<strong>書くときの感覚:</strong> Markdown/MDXは「本文を書く場所」、frontmatterは「記事一覧やSEOで使う記事カードの情報」と考えると分かりやすいです。
</div>
</section>

<section id="content-collections" data-search-section>
<h2>4. Content Collectionsは記事の形をそろえる仕組み</h2>
<p class="lead">Content Collectionsは、記事ファイルの集まりをAstroから安全に扱うための仕組みです。</p>

<p>このサイトでは、記事は <code>src/content/articles/</code> 以下に置きます。カテゴリごとに <code>web/</code>、<code>languages/</code>、<code>tools/</code> のようなフォルダに分かれています。</p>

<div class="diagram">
<pre class="mermaid">
flowchart TD
  Root["src/content/articles/"] --> Web["web/"]
  Root --> Lang["languages/"]
  Root --> Tools["tools/"]
  Web --> A1["web-technology-complete-guide.md"]
  Lang --> A2["python-uv-complete-guide.md"]
  Tools --> A3["site-technology-stack-guide.md"]
  Config["src/content.config.ts"] --> Root
</pre>
</div>

<p><code>src/content.config.ts</code> では、記事に必要なfrontmatterの形が定義されています。</p>

<pre><code class="language-ts">const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    categorySlug: z.string(),
    tags: z.array(z.string()),
    level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    updated: z.string(),
    draft: z.boolean().default(false)
  })
});</code></pre>

<p>これにより、記事に <code>title</code> や <code>categorySlug</code> が足りない場合、ビルド時に気づきやすくなります。記事が増えても、一覧ページやカテゴリページが同じ形のデータとして扱えるのが利点です。</p>
</section>

<section id="pagefind" data-search-section>
<h2>5. Pagefindは静的サイトに検索を足す道具</h2>
<p class="lead">Pagefindは、完成したHTMLを読み取り、ブラウザ上で使える検索インデックスを作るツールです。</p>

<p>このサイトの <code>package.json</code> には、検索用のコマンドが用意されています。</p>

<pre><code class="language-json">{
  "scripts": {
    "build": "astro build",
    "pagefind": "pagefind --site dist",
    "build:search": "astro build && pagefind --site dist"
  }
}</code></pre>

<table>
<thead>
<tr><th>コマンド</th><th>何をするか</th><th>使う場面</th></tr>
</thead>
<tbody>
<tr><td><code>npm run build</code></td><td>Astroで静的サイトを生成する</td><td>記事やページが壊れていないか確認する</td></tr>
<tr><td><code>npm run pagefind</code></td><td><code>dist/</code> のHTMLから検索インデックスを作る</td><td>検索データだけ作り直したいとき</td></tr>
<tr><td><code>npm run build:search</code></td><td>ビルド後にPagefindを実行する</td><td>公開前に検索まで含めて確認したいとき</td></tr>
</tbody>
</table>

<div class="note">
<strong>注意:</strong> Pagefindは通常、Astroのビルド後に実行します。先に <code>dist/</code> のHTMLがないと、検索対象がありません。
</div>
</section>

<section id="mermaid" data-search-section>
<h2>6. Mermaidは図解をテキストで書く道具</h2>
<p class="lead">Mermaidを使うと、フローチャートや関係図をテキストとして記事内に保存できます。</p>

<p>このサイトの記事では、次のように <code>pre</code> と <code>mermaid</code> クラスを使って図を置いています。</p>

<pre><code class="language-html">&lt;div class="diagram"&gt;
&lt;pre class="mermaid"&gt;
flowchart LR
  A["記事を書く"] --&gt; B["ビルドする"]
  B --&gt; C["公開する"]
&lt;/pre&gt;
&lt;/div&gt;</code></pre>

<p>画像ファイルとして図を作る方法と違い、本文と同じGit管理に載せられます。あとから文章を直すのと同じ感覚で図も直せるため、技術解説記事と相性がよいです。</p>
</section>

<section id="cloudflare-pages" data-search-section>
<h2>7. Cloudflare Pagesは静的ファイルを公開する場所</h2>
<p class="lead">Cloudflare Pagesは、ビルド済みの静的ファイルをインターネットに配信するホスティングサービスです。</p>

<p>このサイトは <code>output: "static"</code> のAstroサイトなので、基本的には次の流れで公開できます。</p>

<ol>
<li>記事やコードを編集する</li>
<li><code>npm run build</code> で <code>dist/</code> を生成する</li>
<li>GitHubへ変更を反映する</li>
<li>Cloudflare Pagesがビルドして公開する</li>
</ol>

<p>Cloudflare Pages側の代表的な設定は、Astroの公式手順では次のようになります。</p>

<table>
<thead>
<tr><th>設定項目</th><th>値</th></tr>
</thead>
<tbody>
<tr><td>Framework preset</td><td><code>Astro</code></td></tr>
<tr><td>Build command</td><td><code>npm run build</code></td></tr>
<tr><td>Build output directory</td><td><code>dist</code></td></tr>
</tbody>
</table>

<div class="note">
<strong>この構成の良さ:</strong> 記事サイトとしては、データベースや常時動くサーバーを持たずに公開できます。管理するものが少ないので、書き続けることに集中しやすくなります。
</div>
</section>

<section id="workflow" data-search-section>
<h2>8. 記事を追加するときの作業順</h2>
<p class="lead">このサイトで新しい記事を追加するときは、ファイル作成、frontmatter記入、本文作成、ビルド確認の順に進めます。</p>

<pre><code class="language-powershell"># 依存関係を入れていない場合だけ実行
npm install

# 開発サーバーを起動
npm run dev

# 公開用HTMLを生成して確認
npm run build

# 検索インデックスまで作る
npm run build:search</code></pre>

<table>
<thead>
<tr><th>確認すること</th><th>見る場所</th></tr>
</thead>
<tbody>
<tr><td>記事が一覧に出るか</td><td><code>/articles/</code></td></tr>
<tr><td>カテゴリページに出るか</td><td><code>/categories/tools/</code> など</td></tr>
<tr><td>目次リンクが動くか</td><td>記事ページの左側または上部の目次</td></tr>
<tr><td>コードブロックが読みやすいか</td><td>記事本文のサンプルコード</td></tr>
<tr><td>検索対象に入るか</td><td>Pagefind実行後の検索UI</td></tr>
</tbody>
</table>
</section>

<section id="pitfalls" data-search-section>
<h2>9. よくあるつまずき</h2>
<p class="lead">静的サイトは仕組みが軽い一方で、記事ファイルの書き方やビルド順を間違えると表示に影響します。</p>

<table>
<thead>
<tr><th>つまずき</th><th>原因</th><th>対策</th></tr>
</thead>
<tbody>
<tr><td>記事が一覧に出ない</td><td>frontmatter不足、カテゴリslug違い、draft設定など</td><td><code>src/content.config.ts</code> と既存記事を見比べる</td></tr>
<tr><td>目次リンクが飛ばない</td><td><code>&lt;section id="..."&gt;</code> が本文上で正しくHTMLとして解釈されていない</td><td>HTMLタグ行を不要にインデントしない</td></tr>
<tr><td>検索に出ない</td><td>Pagefindをビルド前に実行している</td><td><code>npm run build:search</code> の順序で実行する</td></tr>
<tr><td>図解が表示されない</td><td>Mermaidの記法ミス、または表示側の初期化不足</td><td>短い図から作り、括弧や引用符を確認する</td></tr>
<tr><td>公開結果が古い</td><td>GitHubへの反映やCloudflare Pagesのビルドが完了していない</td><td>デプロイログと対象ブランチを確認する</td></tr>
</tbody>
</table>
</section>

<section id="summary" data-search-section>
<h2>10. まず覚えること</h2>
<p class="lead">このサイトは、文章を増やしやすく、静的に速く配信できる構成です。</p>

<ul>
<li>Astroは、記事やページを静的HTMLへ組み立てる。</li>
<li>Markdown/MDXは、記事本文を書くための形式。</li>
<li>Content Collectionsは、記事のメタ情報をそろえて扱う仕組み。</li>
<li>Pagefindは、ビルド済みHTMLから検索を作る。</li>
<li>Mermaidは、図解をテキストで管理する。</li>
<li>Cloudflare Pagesは、生成された <code>dist/</code> を公開する場所。</li>
<li>GitHubは、変更履歴とデプロイ連携の中心になる。</li>
</ul>
</section>

<section id="sources" data-search-section>
<h2>参考ソース</h2>
<ul>
<li><a href="https://docs.astro.build/en/guides/content-collections/">Astro Docs: Content Collections</a></li>
<li><a href="https://docs.astro.build/en/guides/integrations-guide/mdx/">Astro Docs: @astrojs/mdx</a></li>
<li><a href="https://pagefind.app/">Pagefind 公式サイト</a></li>
<li><a href="https://pagefind.app/docs/running-pagefind/">Pagefind Docs: Running Pagefind</a></li>
<li><a href="https://docs.astro.build/en/guides/deploy/cloudflare/">Astro Docs: Deploy your Astro Site to Cloudflare Pages</a></li>
<li><a href="https://mermaid.js.org/intro/">Mermaid Docs: About Mermaid</a></li>
</ul>
</section>
