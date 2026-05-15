---
title: "初心者でもわかるウェブ技術 完全ガイド"
description: "ブラウザ、HTTP、HTML/CSS/JavaScript、デプロイまでを一枚の地図として整理。"
category: "Web基礎"
categorySlug: "web"
tags: ["Web", "HTML", "CSS", "JavaScript", "HTTP", "デプロイ"]
level: "beginner"
updated: "2026-05-10"
---

<p class="lead">HTML、CSS、JavaScriptから、React、TypeScript、Next.js、API、DB、デプロイ、セキュリティまで。バイブコーディングで出てくる名前を「何者で、どこに置かれる技術か」から理解できるようにまとめた実践ガイドです。</p>

<section id="overview" data-search-section>
          <h2>1. ウェブアプリの全体像</h2>
          <p class="lead">ウェブアプリは「ブラウザで動く画面」と「サーバー側の処理」と「データを保存する場所」が、HTTPという約束で会話する仕組みです。</p>
          <div class="diagram">
            <pre class="mermaid">
flowchart LR
  U["ユーザー"] --> B["ブラウザ"]
  B -->|"HTTPリクエスト"| W["Webサーバー / CDN"]
  W --> A["アプリサーバー / API"]
  A --> D[("データベース")]
  A --> S["外部サービス\n決済・メール・AI・認証"]
  A -->|"JSON / HTML"| B
  B -->|"HTML + CSS + JavaScriptを解釈"| UI["画面"]
            </pre>
          </div>
          <div class="grid">
            <article class="card">
              <h3>見る場所</h3>
              <p>ユーザーの端末にあるブラウザ。HTMLを読み、CSSで見た目を作り、JavaScriptで操作に反応します。</p>
            </article>
            <article class="card">
              <h3>考える場所</h3>
              <p>サーバー。ログイン判定、データ取得、決済、AI呼び出しなど、ユーザーに直接見せたくない処理を担当します。</p>
            </article>
            <article class="card">
              <h3>覚える場所</h3>
              <p>データベースやストレージ。ユーザー、投稿、商品、画像、設定、履歴などを保存します。</p>
            </article>
          </div>
          <div class="note">
            <strong>最初の理解:</strong> フレームワークやクラウド名は多く見えますが、ほとんどは「画面を作る」「サーバー処理を書く」「データを保存する」「公開して運用する」のどこかに分類できます。
          </div>
        </section>
        <section id="core" data-search-section>
          <h2>2. HTML・CSS・JavaScript</h2>
          <p class="lead">ブラウザで動くウェブの三大基礎です。まずここが地面です。</p>
          <table>
            <thead>
              <tr><th>技術</th><th>一言でいうと</th><th>担当すること</th><th>例</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>HTML</strong></td>
                <td>文書と構造</td>
                <td>見出し、段落、リンク、フォーム、画像など「意味」を作る</td>
                <td><code>&lt;h1&gt;</code>、<code>&lt;button&gt;</code>、<code>&lt;form&gt;</code></td>
              </tr>
              <tr>
                <td><strong>CSS</strong></td>
                <td>見た目とレイアウト</td>
                <td>色、余白、文字サイズ、配置、レスポンシブ対応を作る</td>
                <td><code>display: grid</code>、<code>color</code>、<code>@media</code></td>
              </tr>
              <tr>
                <td><strong>JavaScript</strong></td>
                <td>動きと振る舞い</td>
                <td>クリック反応、入力チェック、API通信、画面更新を行う</td>
                <td><code>addEventListener</code>、<code>fetch</code>、状態管理</td>
              </tr>
            </tbody>
          </table>
          <h3>同じボタンを三層で見る</h3>
          <pre><code class="language-html">&lt;button class="save-button" id="saveButton"&gt;保存&lt;/button&gt;

&lt;style&gt;
  .save-button {
    background: #146c68;
    color: white;
    padding: 10px 16px;
  }
&lt;/style&gt;

&lt;script&gt;
  document.querySelector("#saveButton").addEventListener("click", () =&gt; {
    alert("保存しました");
  });
&lt;/script&gt;</code></pre>
          <p>HTMLが「これはボタン」と定義し、CSSが「どう見えるか」を決め、JavaScriptが「押したら何が起きるか」を決めます。</p>
        </section>

        <section id="browser" data-search-section>
          <h2>3. ブラウザ・DOM・HTTP</h2>
          <p class="lead">ウェブ技術はブラウザの中で動き、ネットワーク越しにHTTPで会話します。</p>
          <div class="grid two">
            <article class="card">
              <h3>DOM</h3>
              <p>HTMLをブラウザが読み取って作る、操作可能な木構造です。JavaScriptはDOMを変更することで画面を書き換えます。</p>
            </article>
            <article class="card">
              <h3>HTTP</h3>
              <p>ブラウザとサーバーが会話するためのプロトコルです。GETで取得し、POSTで送信し、ステータスコードで結果を伝えます。</p>
            </article>
          </div>
          <div class="diagram">
            <pre class="mermaid">
sequenceDiagram
  participant User as ユーザー
  participant Browser as ブラウザ
  participant Server as サーバー
  participant DB as データベース
  User->>Browser: URLを開く / ボタンを押す
  Browser->>Server: GET / POST / PATCH / DELETE
  Server->>DB: 必要なデータを読む・書く
  DB-->>Server: 結果
  Server-->>Browser: HTML または JSON
  Browser-->>User: 画面を表示・更新
            </pre>
          </div>
          <h3>ブラウザが画面を描くまで</h3>
          <div class="diagram">
            <pre class="mermaid">
flowchart LR
  HTML["HTMLを読む"] --> DOM["DOMツリー"]
  CSS["CSSを読む"] --> CSSOM["CSSOM"]
  DOM --> Render["レンダーツリー"]
  CSSOM --> Render
  Render --> Layout["レイアウト\n位置とサイズ"]
  Layout --> Paint["ペイント\n色・画像・文字"]
  Paint --> Composite["合成\n画面に表示"]
  JS["JavaScript"] --> DOM
  JS --> CSSOM
            </pre>
          </div>
          <p>DevToolsのElements、Console、Network、Performanceは、この流れを観察するための道具です。表示崩れはElements、通信エラーはNetwork、JavaScriptエラーはConsole、重さはPerformanceで見ると切り分けやすくなります。</p>
          <h3>URL・JSON・Cookie・CORS</h3>
          <table>
            <thead>
              <tr><th>名前</th><th>何者か</th><th>初心者がつまずきやすい点</th></tr>
            </thead>
            <tbody>
              <tr><td>URL</td><td>Web上の場所を示す住所</td><td>ドメイン、パス、クエリ、ハッシュは役割が違う</td></tr>
              <tr><td>JSON</td><td>APIでよく使うデータ形式</td><td>JavaScriptのオブジェクトに似ているが、文字列キーや値の形式にルールがある</td></tr>
              <tr><td>Cookie</td><td>ブラウザに保存され、リクエスト時に送られる小さな情報</td><td>ログインセッションに使う場合はSecure、HttpOnly、SameSiteを意識する</td></tr>
              <tr><td>CORS</td><td>別オリジンへのブラウザ通信を制御する仕組み</td><td>サーバー側が許可しないと、ブラウザがレスポンス利用を止める</td></tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr><th>ステータス</th><th>意味</th><th>よくある場面</th></tr>
            </thead>
            <tbody>
              <tr><td>200</td><td>成功</td><td>ページやAPIが正常に返った</td></tr>
              <tr><td>301 / 302</td><td>リダイレクト</td><td>別URLへ移動</td></tr>
              <tr><td>400</td><td>リクエストが不正</td><td>入力値や形式が間違っている</td></tr>
              <tr><td>401 / 403</td><td>認証・権限エラー</td><td>ログインしていない、権限がない</td></tr>
              <tr><td>404</td><td>見つからない</td><td>URLやデータが存在しない</td></tr>
              <tr><td>500</td><td>サーバーエラー</td><td>サーバー側の例外や設定ミス</td></tr>
            </tbody>
          </table>
        </section>

        <section id="assets" data-search-section>
          <h2>4. SVG・Mermaid・画像・Canvas</h2>
          <p class="lead">画面に出るものはHTMLテキストだけではありません。図、アイコン、写真、動画、グラフも重要な構成要素です。</p>
          <div class="grid">
            <article class="card">
              <h3>SVG</h3>
              <p>拡大しても荒れにくいベクター画像。アイコン、ロゴ、簡単な図解に向いています。HTMLに直接埋め込めるのでCSSやJSで操作できます。</p>
            </article>
            <article class="card">
              <h3>Mermaid</h3>
              <p>テキストから図を生成するツール。フローチャート、シーケンス図、ER図などをドキュメント内で管理しやすくします。</p>
            </article>
            <article class="card">
              <h3>Canvas / WebGL</h3>
              <p>ピクセルや3Dをコードで描く領域。ゲーム、画像編集、複雑な可視化、3D表現に向いています。</p>
            </article>
          </div>
          <svg class="mini-svg" viewBox="0 0 820 230" role="img" aria-label="SVGと画像とMermaidの使い分け">
            <rect x="10" y="18" width="800" height="190" rx="12" fill="#fff" stroke="#d9ded8"></rect>
            <g font-family="Inter, system-ui, sans-serif">
              <circle cx="110" cy="104" r="54" fill="#e6f2ef" stroke="#146c68" stroke-width="3"></circle>
              <text x="110" y="99" text-anchor="middle" font-size="24" font-weight="800" fill="#173c39">SVG</text>
              <text x="110" y="129" text-anchor="middle" font-size="14" fill="#40505c">ロゴ・アイコン</text>
              <rect x="256" y="54" width="160" height="104" rx="8" fill="#f8eee9" stroke="#a9422b" stroke-width="3"></rect>
              <path d="M284 132l33-36 24 24 18-20 30 32" fill="none" stroke="#a9422b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
              <text x="336" y="188" text-anchor="middle" font-size="16" font-weight="750" fill="#40505c">写真・ビットマップ</text>
              <rect x="506" y="54" width="212" height="104" rx="8" fill="#edf4f7" stroke="#345995" stroke-width="3"></rect>
              <path d="M544 106h52M596 106l40-28M596 106l40 28" fill="none" stroke="#345995" stroke-width="4" stroke-linecap="round"></path>
              <text x="612" y="188" text-anchor="middle" font-size="16" font-weight="750" fill="#40505c">Mermaidで設計図</text>
            </g>
          </svg>
          <h3>Mermaidは設計の会話に強い</h3>
          <pre><code class="language-mermaid">flowchart TD
  A["要件"] --&gt; B["画面設計"]
  B --&gt; C["API設計"]
  C --&gt; D["DB設計"]
  D --&gt; E["実装"]
  E --&gt; F["テストとデプロイ"]</code></pre>
          <p>コードとして差分管理できるので、設計の変更履歴も追いやすくなります。</p>
        </section>

        <section id="js-stack" data-search-section>
          <h2>5. JavaScript系スタックの関係性</h2>
          <p class="lead">Next.js、TypeScript、React、Node.js、Vite、npmは同じ階層の競合ではありません。役割が違います。</p>
          <div class="diagram">
            <pre class="mermaid">
flowchart TB
  JS["JavaScript\n言語そのもの"] --> TS["TypeScript\n型を足したJavaScript"]
  JS --> Browser["ブラウザ実行環境"]
  JS --> Node["Node.js\nサーバー・CLIでJSを動かす実行環境"]
  Node --> NPM["npm / pnpm / yarn\nパッケージ管理"]
  NPM --> Vite["Vite\n開発サーバー・ビルドツール"]
  NPM --> Next["Next.js\nReactベースのフルスタックフレームワーク"]
  JS --> React["React\nUIを部品で作るライブラリ"]
  TS --> React
  React --> Next
  Vite --> ReactApp["React SPA\nブラウザ中心のアプリ"]
            </pre>
          </div>
          <table>
            <thead>
              <tr><th>名前</th><th>分類</th><th>何を解決するか</th><th>競合しやすい相手</th></tr>
            </thead>
            <tbody>
              <tr><td>JavaScript</td><td>言語</td><td>ブラウザやNode.jsで動くプログラムを書く</td><td>Python、Ruby、Goなど</td></tr>
              <tr><td>TypeScript</td><td>言語拡張</td><td>JavaScriptに型を足して、バグを早く見つける</td><td>素のJavaScript</td></tr>
              <tr><td>React</td><td>UIライブラリ</td><td>画面をコンポーネントとして組み立てる</td><td>Vue、Svelte、Solidなど</td></tr>
              <tr><td>Next.js</td><td>フレームワーク</td><td>Reactにルーティング、サーバー処理、最適化、ビルド規約を足す</td><td>Nuxt、SvelteKit、Remix系、Astroなど</td></tr>
              <tr><td>Vite</td><td>開発・ビルドツール</td><td>高速な開発サーバーと本番ビルドを提供する</td><td>Webpack、Rspack、Parcelなど</td></tr>
              <tr><td>Node.js</td><td>実行環境</td><td>ブラウザ外でJavaScriptを動かす。サーバーやビルドツールの土台になる</td><td>Deno、Bunなど</td></tr>
              <tr><td>npm</td><td>パッケージ管理</td><td>ライブラリの取得、バージョン管理、スクリプト実行を行う</td><td>pnpm、Yarnなど</td></tr>
            </tbody>
          </table>
          <div class="note">
            <strong>具体例:</strong> 「Next.js + TypeScript + React」は、ReactでUIを書き、TypeScriptで型を付け、Next.jsの規約でページ・サーバー処理・ビルドをまとめる構成です。ReactとNext.jsは横並びというより、Next.jsがReactを土台にしている関係です。
          </div>
          <h3>Reactだけ、Next.js、Viteの違い</h3>
          <table>
            <thead>
              <tr><th>構成</th><th>向いているもの</th><th>考えること</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>HTML + CSS + JS</td>
                <td>小さなページ、教材、単純なツール</td>
                <td>ファイル構成、部品化、状態管理を自分で決める</td>
              </tr>
              <tr>
                <td>Vite + React</td>
                <td>ブラウザ中心のSPA、管理画面、プロトタイプ</td>
                <td>ルーティング、API、認証、SEOを必要に応じて追加する</td>
              </tr>
              <tr>
                <td>Next.js</td>
                <td>ページ数があるサービス、SEO、サーバー処理込みのアプリ</td>
                <td>サーバーコンポーネント、キャッシュ、デプロイ環境の理解が必要</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="frontend" data-search-section>
          <h2>6. フロントエンドの作り方</h2>
          <p class="lead">フロントエンドは、ユーザーが直接触る部分です。見た目だけでなく、状態、入力、アクセシビリティ、API通信まで含みます。</p>
          <div class="grid">
            <article class="card">
              <h3>コンポーネント</h3>
              <p>ボタン、カード、フォーム、一覧などを再利用可能な部品にします。React、Vue、Svelteなどが得意です。</p>
            </article>
            <article class="card">
              <h3>状態管理</h3>
              <p>選択中のタブ、入力値、ログインユーザー、取得済みデータなど、画面が覚えている情報を扱います。</p>
            </article>
            <article class="card">
              <h3>ルーティング</h3>
              <p>URLに応じて表示する画面を切り替えます。Next.jsではファイル構成がルートになります。</p>
            </article>
          </div>
          <h3>レンダリング方式</h3>
          <table>
            <thead>
              <tr><th>方式</th><th>意味</th><th>強み</th><th>注意点</th></tr>
            </thead>
            <tbody>
              <tr><td>CSR</td><td>ブラウザ側で画面を作る</td><td>操作感が軽いSPAにしやすい</td><td>初回表示やSEOに工夫が必要</td></tr>
              <tr><td>SSR</td><td>リクエストごとにサーバーでHTMLを作る</td><td>初回表示やSEOに強い</td><td>サーバー負荷とキャッシュ設計が必要</td></tr>
              <tr><td>SSG</td><td>ビルド時にHTMLを作る</td><td>高速・安定・安価</td><td>頻繁に変わるデータには再生成が必要</td></tr>
              <tr><td>ISR / 再検証</td><td>静的ページを後から更新する</td><td>速度と鮮度のバランスを取れる</td><td>更新タイミングの理解が必要</td></tr>
              <tr><td>RSC</td><td>React Server Components</td><td>サーバーで完結できるUI処理を増やせる</td><td>サーバー/クライアント境界の理解が必要</td></tr>
            </tbody>
          </table>
        </section>

        <section id="backend" data-search-section>
          <h2>7. バックエンドとAPI</h2>
          <p class="lead">バックエンドは、ユーザーに見せるべきでない処理や、信頼できる場所で行うべき処理を担当します。</p>
          <div class="diagram">
            <pre class="mermaid">
flowchart LR
  UI["フロントエンド"] --> API["API"]
  API --> Auth["認証・認可"]
  API --> Logic["業務ロジック"]
  API --> DB[("DB")]
  API --> Queue["キュー / バッチ"]
  API --> External["外部API\n決済・メール・AI"]
            </pre>
          </div>
          <table>
            <thead>
              <tr><th>概念</th><th>役割</th><th>例</th></tr>
            </thead>
            <tbody>
              <tr><td>API</td><td>フロントエンドや外部サービスが使う窓口</td><td>REST、GraphQL、RPC、Server Actions</td></tr>
              <tr><td>OpenAPI</td><td>APIの仕様を機械可読な形で書く</td><td>エンドポイント、入力、出力、エラーを共有する</td></tr>
              <tr><td>認証</td><td>誰かを確認する</td><td>ログイン、OAuth、メールリンク、パスキー</td></tr>
              <tr><td>認可</td><td>何をしてよいか決める</td><td>管理者だけ削除可能、本人だけ編集可能</td></tr>
              <tr><td>業務ロジック</td><td>アプリ固有のルール</td><td>在庫計算、予約可否、料金計算</td></tr>
              <tr><td>ジョブ</td><td>時間のかかる処理を裏で実行</td><td>メール送信、画像変換、AI生成、集計</td></tr>
            </tbody>
          </table>
          <div class="warning note">
            <strong>重要:</strong> APIキー、DBパスワード、管理者権限の処理はブラウザに置かないでください。ブラウザに送ったものはユーザーから見える前提で設計します。
          </div>
        </section>

        <section id="data" data-search-section>
          <h2>8. データベース・ストレージ・状態</h2>
          <p class="lead">「いま画面で覚える状態」と「長く保存するデータ」は別物です。</p>
          <div class="grid">
            <article class="card">
              <h3>UI状態</h3>
              <p>モーダルの開閉、選択中タブ、入力中フォーム。消えても大きな問題がない短命な状態です。</p>
            </article>
            <article class="card">
              <h3>サーバー状態</h3>
              <p>APIから取得するユーザー、投稿、商品など。キャッシュ、再取得、更新衝突を考えます。</p>
            </article>
            <article class="card">
              <h3>永続データ</h3>
              <p>DBやストレージに保存する、アプリの本体となる情報です。設計ミスの影響が大きい領域です。</p>
            </article>
          </div>
          <h3>DBの大まかな分類</h3>
          <table>
            <thead>
              <tr><th>種類</th><th>向いているもの</th><th>代表例</th></tr>
            </thead>
            <tbody>
              <tr><td>リレーショナルDB</td><td>整合性が大事な業務データ</td><td>PostgreSQL、MySQL、SQLite</td></tr>
              <tr><td>ドキュメントDB</td><td>柔軟なJSON構造</td><td>MongoDB、Firestore</td></tr>
              <tr><td>キー・バリュー</td><td>高速キャッシュ、セッション</td><td>Redis、Upstash Redis、DynamoDB系</td></tr>
              <tr><td>オブジェクトストレージ</td><td>画像、動画、PDFなどのファイル</td><td>S3、R2、Blob Storage</td></tr>
              <tr><td>検索エンジン</td><td>全文検索、ランキング、ログ検索</td><td>Elasticsearch、Meilisearch、Algolia</td></tr>
            </tbody>
          </table>
        </section>

        <section id="deploy" data-search-section>
          <h2>9. デプロイ・クラウド・運用</h2>
          <p class="lead">作ったものを他人が使える状態に公開し、壊れたときに直せるようにする領域です。</p>
          <div class="timeline">
            <div class="step"><b>1</b><div><strong>開発:</strong> ローカルで実装し、Gitで変更を管理します。</div></div>
            <div class="step"><b>2</b><div><strong>ビルド:</strong> TypeScriptやReactなどを、ブラウザやサーバーで動く形に変換します。</div></div>
            <div class="step"><b>3</b><div><strong>テスト:</strong> 自動テスト、型チェック、Lint、プレビュー確認で壊れていないか見ます。</div></div>
            <div class="step"><b>4</b><div><strong>デプロイ:</strong> Vercel、Netlify、Cloudflare、AWSなどへ公開します。</div></div>
            <div class="step"><b>5</b><div><strong>運用:</strong> ログ、監視、エラー通知、バックアップ、セキュリティ更新を続けます。</div></div>
          </div>
          <h3>ホスティングの選び方</h3>
          <table>
            <thead>
              <tr><th>種類</th><th>向いているもの</th><th>例</th></tr>
            </thead>
            <tbody>
              <tr><td>静的ホスティング</td><td>HTML/CSS/JSだけのサイト、SSG</td><td>GitHub Pages、Netlify、Cloudflare Pages</td></tr>
              <tr><td>フルスタックPaaS</td><td>Next.jsなどのサーバー処理込みアプリ</td><td>Vercel、Netlify、Render</td></tr>
              <tr><td>クラウドVM / コンテナ</td><td>自由度の高いサーバー運用</td><td>AWS、GCP、Azure、Docker</td></tr>
              <tr><td>エッジ実行</td><td>低遅延なAPI、ミドルウェア、軽量処理</td><td>Cloudflare Workers、Vercel Edge</td></tr>
            </tbody>
          </table>
        </section>

        <section id="quality" data-search-section>
          <h2>10. 品質: テスト・アクセシビリティ・パフォーマンス</h2>
          <p class="lead">動くだけでなく、壊れにくく、速く、誰でも使えることがプロダクトの品質です。</p>
          <div class="grid">
            <article class="card">
              <h3>テスト</h3>
              <p>関数の単体テスト、画面のコンポーネントテスト、ユーザー操作を再現するE2Eテストがあります。</p>
            </article>
            <article class="card">
              <h3>アクセシビリティ</h3>
              <p>キーボード操作、読み上げ、色のコントラスト、フォームラベルなどを整え、より多くの人が使えるようにします。</p>
            </article>
            <article class="card">
              <h3>パフォーマンス</h3>
              <p>表示速度、操作への反応、レイアウトの安定性を改善します。画像最適化と不要なJS削減が効きます。</p>
            </article>
          </div>
          <table>
            <thead>
              <tr><th>指標・観点</th><th>見るもの</th><th>改善例</th></tr>
            </thead>
            <tbody>
              <tr><td>LCP</td><td>主要コンテンツが見えるまでの速さ</td><td>画像最適化、SSR/SSG、キャッシュ</td></tr>
              <tr><td>INP</td><td>操作への反応</td><td>重いJSを分割、再レンダリング削減</td></tr>
              <tr><td>CLS</td><td>表示中のレイアウトずれ</td><td>画像サイズ指定、フォント読み込み調整</td></tr>
              <tr><td>WCAG</td><td>アクセシビリティの基準</td><td>意味のあるHTML、十分なコントラスト、フォーカス表示</td></tr>
            </tbody>
          </table>
        </section>

        <section id="security" data-search-section>
          <h2>11. セキュリティの基本</h2>
          <p class="lead">セキュリティは後付けではなく、入力、認証、権限、依存関係、ログのすべてに関わります。</p>
          <div class="grid two">
            <article class="card">
              <h3>よくある危険</h3>
              <ul>
                <li>権限チェック漏れ</li>
                <li>SQLインジェクション</li>
                <li>XSS</li>
                <li>CSRF</li>
                <li>秘密情報の漏えい</li>
                <li>古い依存ライブラリ</li>
              </ul>
            </article>
            <article class="card">
              <h3>基本対策</h3>
              <ul>
                <li>サーバー側で必ず権限チェックする</li>
                <li>SQLはプレースホルダーやORMを使う</li>
                <li>HTMLに差し込む値をエスケープする</li>
                <li>APIキーはサーバー側の環境変数に置く</li>
                <li>依存関係を更新し、脆弱性を確認する</li>
                <li>ログと監視で異常を検知する</li>
              </ul>
            </article>
          </div>
          <div class="warning note">
            <strong>バイブコーディング時の注意:</strong> 生成AIに「動くコード」を出してもらったら、認証・認可・入力検証・秘密情報の扱いは人間が必ずレビューしてください。ここは雰囲気で通すと事故になります。
          </div>
        </section>

        <section id="choose" data-search-section>
          <h2>12. 技術スタックの選び方</h2>
          <p class="lead">流行ではなく、作りたいものの性質から選ぶと迷いにくくなります。</p>
          <div class="diagram">
            <pre class="mermaid">
flowchart TD
  A["何を作る？"] --> B{"公開ページ中心？"}
  B -- "はい" --> C{"更新頻度は低い？"}
  C -- "はい" --> SSG["Astro / Next.js SSG / 静的HTML"]
  C -- "いいえ" --> NEXT["Next.js / Nuxt / SvelteKit"]
  B -- "いいえ" --> D{"アプリ操作が中心？"}
  D -- "はい" --> SPA["Vite + React / Vue / Svelte"]
  D -- "いいえ" --> SIMPLE["まずHTML + CSS + JS"]
  SPA --> E{"サーバー処理が多い？"}
  E -- "はい" --> FULL["Next.jsなどフルスタック"]
  E -- "いいえ" --> API["外部BaaS / 軽量API"]
            </pre>
          </div>
          <h3>目的別の初期構成</h3>
          <table>
            <thead>
              <tr><th>目的</th><th>おすすめ初期構成</th><th>理由</th></tr>
            </thead>
            <tbody>
              <tr><td>学習用の小さなページ</td><td>HTML + CSS + JavaScript</td><td>基礎が見えやすく、セットアップが少ない</td></tr>
              <tr><td>管理画面・ツール</td><td>Vite + React + TypeScript</td><td>速く作れて、部品化しやすい</td></tr>
              <tr><td>SEOが大事なサービス</td><td>Next.js + TypeScript</td><td>ルーティング、SSR/SSG、画像最適化が揃う</td></tr>
              <tr><td>ブログ・コンテンツサイト</td><td>Astro / Next.js / 静的サイト生成</td><td>軽く、速く、運用しやすい</td></tr>
              <tr><td>リアルタイム性が高いアプリ</td><td>React等 + WebSocket + 専用バックエンド</td><td>双方向通信と状態同期が重要になる</td></tr>
              <tr><td>AI機能付きアプリ</td><td>Next.js等 + サーバーAPI + DB</td><td>APIキー保護、履歴保存、課金管理が必要</td></tr>
            </tbody>
          </table>
        </section>

        <section id="roadmap" data-search-section>
          <h2>13. 学習ロードマップ</h2>
          <p class="lead">全部を同時に覚える必要はありません。作りながら、層を一枚ずつ増やすのが近道です。</p>
          <div class="timeline">
            <div class="step"><b>1</b><div><strong>HTML/CSS:</strong> 見出し、リンク、フォーム、Flexbox、Grid、レスポンシブを理解する。</div></div>
            <div class="step"><b>2</b><div><strong>JavaScript:</strong> DOM操作、イベント、配列、オブジェクト、非同期、fetchを学ぶ。</div></div>
            <div class="step"><b>3</b><div><strong>Gitとnpm:</strong> 変更管理、依存関係、開発サーバー、ビルドの意味を覚える。</div></div>
            <div class="step"><b>4</b><div><strong>React + TypeScript:</strong> コンポーネント、props、state、型、フォーム、API取得を作る。</div></div>
            <div class="step"><b>5</b><div><strong>Next.js:</strong> ルーティング、サーバー/クライアント境界、データ取得、認証、デプロイを学ぶ。</div></div>
            <div class="step"><b>6</b><div><strong>DBとバックエンド:</strong> テーブル設計、CRUD、認可、トランザクション、ログを扱う。</div></div>
            <div class="step"><b>7</b><div><strong>品質:</strong> テスト、アクセシビリティ、パフォーマンス、セキュリティレビューを習慣にする。</div></div>
          </div>
          <h3>バイブコーディング用プロンプトの型</h3>
          <pre><code class="language-text">目的:
作りたいユーザー体験:
必要な画面:
保存するデータ:
使いたい技術スタック:
避けたいこと:
セキュリティ上の注意:
完成条件:
検証してほしいこと:</code></pre>
          <p>技術名だけで依頼するより、「何を保存するか」「誰が何をできるか」「完成条件」を書くと、生成される設計がかなり安定します。</p>
        </section>

        <section id="glossary" data-search-section>
          <h2>14. ざっくり用語集</h2>
          <ul class="pill-list">
            <li>ライブラリ: 部品として使う道具</li>
            <li>フレームワーク: 作り方の型ごと提供する道具</li>
            <li>ランタイム: コードを実行する環境</li>
            <li>ビルド: 開発用コードを本番用に変換すること</li>
            <li>バンドル: 複数ファイルを配信用にまとめること</li>
            <li>トランスパイル: TSや新しいJSを別のJSへ変換すること</li>
            <li>ルーティング: URLと画面・処理を結びつけること</li>
            <li>SSR: サーバーでHTMLを作ること</li>
            <li>CSR: ブラウザで画面を作ること</li>
            <li>API: ソフトウェア同士の窓口</li>
            <li>ORM: DB操作をコードで扱いやすくする道具</li>
            <li>CDN: 静的ファイルを世界中から速く配る仕組み</li>
            <li>CI/CD: テストやデプロイを自動化する流れ</li>
            <li>環境変数: 環境ごとに変わる設定や秘密情報</li>
            <li>オリジン: スキーム、ホスト、ポートの組み合わせ</li>
            <li>CORS: 別オリジン通信のブラウザ側安全ルール</li>
            <li>Cookie: ブラウザが保存してサーバーへ送る小さなデータ</li>
            <li>OpenAPI: API仕様を文書化・共有するための標準的な形式</li>
          </ul>
        </section>

        <section id="sources" data-search-section>
          <h2>15. 参考ソース</h2>
          <p class="lead">内容作成時に確認した公式・信頼性の高い資料です。確認日: 2026-05-10。</p>
          <ul class="source-list">
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML">MDN: HTML</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS">MDN: CSS</a></li>
            <li><a href="https://html.spec.whatwg.org/dev/introduction.html">WHATWG: HTML Standard</a></li>
            <li><a href="https://www.w3.org/TR/css-2025/">W3C: CSS Snapshot 2025</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/SVG">MDN: SVG</a></li>
            <li><a href="https://www.w3.org/TR/SVG/">W3C: SVG 2</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview">MDN: HTTP Overview</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc9110">IETF RFC 9110: HTTP Semantics</a></li>
            <li><a href="https://url.spec.whatwg.org/">WHATWG: URL Standard</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc8259">IETF RFC 8259: JSON</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Learn">MDN: Learn web development</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work">MDN: How browsers work</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/API">MDN: Web APIs</a></li>
            <li><a href="https://react.dev/learn/start-a-new-react-project">React: Start a New React Project</a></li>
            <li><a href="https://react.dev/reference/rsc/server-components">React: Server Components</a></li>
            <li><a href="https://nextjs.org/docs">Next.js Docs</a></li>
            <li><a href="https://nextjs.org/docs/app/getting-started/server-and-client-components">Next.js: Server and Client Components</a></li>
            <li><a href="https://www.typescriptlang.org/docs/handbook/intro.html">TypeScript Handbook</a></li>
            <li><a href="https://vite.dev/guide/why.html">Vite: Why Vite</a></li>
            <li><a href="https://nodejs.org/en/learn">Node.js Learn</a></li>
            <li><a href="https://docs.npmjs.com/about-npm/">npm Docs: About npm</a></li>
            <li><a href="https://mermaid.js.org/intro/">Mermaid Docs</a></li>
            <li><a href="https://spec.openapis.org/oas/latest.html">OpenAPI Specification</a></li>
            <li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/">W3C WAI: WCAG Overview</a></li>
            <li><a href="https://www.w3.org/TR/WCAG22/">W3C: WCAG 2.2</a></li>
            <li><a href="https://web.dev/vitals/">web.dev: Core Web Vitals</a></li>
            <li><a href="https://web.dev/learn/accessibility/">web.dev: Learn Accessibility</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/Security">MDN: Web Security</a></li>
            <li><a href="https://owasp.org/Top10/">OWASP Top 10</a></li>
            <li><a href="https://www.postgresql.org/docs/current/tutorial.html">PostgreSQL Tutorial</a></li>
            <li><a href="https://csrc.nist.gov/pubs/sp/800/145/final">NIST: Cloud Computing Definition</a></li>
            <li><a href="https://docs.docker.com/engine/docker-overview/">Docker Docs: Overview</a></li>
          </ul>
        </section>
