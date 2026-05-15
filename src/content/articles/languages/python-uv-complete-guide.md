---
title: "Python uv完全解説"
description: "高速なPythonパッケージ管理ツールuvの全体像を、役割・基本コマンド・pipやvenvとの違いから整理する入門ガイド。"
category: "プログラミング言語 / 開発ツール"
categorySlug: "languages"
tags: ["Python", "uv", "パッケージ管理", "開発ツール"]
level: "beginner"
updated: "2026-05-16"
draft: false
---

<p class="lead">uvは、Pythonのパッケージ管理、仮想環境、Python本体のバージョン管理、CLIツール実行をまとめて扱える高速な開発ツールです。この記事では「pipやvenvを毎回どう組み合わせればいいのか分からない」という段階から、uvで何をすればよいかを一枚の地図として整理します。</p>

<section id="overview" data-search-section>
  <h2>1. uvとは何か</h2>
  <p class="lead">uvはAstralが開発している、Rust製の高速なPythonパッケージ・プロジェクト管理ツールです。</p>
  <p>公式ドキュメントでは、uvは <code>pip</code>、<code>pip-tools</code>、<code>pipx</code>、<code>poetry</code>、<code>pyenv</code>、<code>virtualenv</code> などの役割をまとめて置き換えられるツールとして説明されています。初心者目線では、「Pythonプロジェクトを作る」「ライブラリを入れる」「仮想環境を用意する」「コマンドを実行する」を、できるだけ少ない手順で扱うための道具と考えると入りやすいです。</p>

  <div class="diagram">
    <pre class="mermaid">
flowchart LR
  U["uv"] --> P["Python本体の管理"]
  U --> V["仮想環境 .venv"]
  U --> D["依存関係 pyproject.toml"]
  U --> L["ロックファイル uv.lock"]
  U --> R["コマンド実行 uv run"]
  U --> T["CLIツール実行 uvx / uv tool"]
    </pre>
  </div>

  <div class="note">
    <strong>最初の理解:</strong> uvは「pipより速いインストーラー」だけではなく、Pythonプロジェクト全体を管理するための入口です。新しいプロジェクトでは、まず <code>uv init</code>、依存関係は <code>uv add</code>、実行は <code>uv run</code> と覚えると迷いにくくなります。
  </div>
</section>

<section id="why-uv" data-search-section>
  <h2>2. uvが解決すること</h2>
  <p class="lead">Python開発では、パッケージ、仮想環境、Pythonバージョン、ロックファイルが別々の話として出てきます。uvはそれらをひとつの操作体系にまとめます。</p>

  <div class="grid">
    <article class="card">
      <h3>環境構築が速い</h3>
      <p>公式ドキュメントでは、uvはpipより10倍から100倍高速と説明されています。特に依存関係が多いプロジェクトや、キャッシュが効く環境で体感しやすいです。</p>
    </article>
    <article class="card">
      <h3>仮想環境を自動で扱える</h3>
      <p><code>uv run</code> や <code>uv sync</code> を使うと、必要に応じてプロジェクト内の <code>.venv</code> を作成し、依存関係を同期します。</p>
    </article>
    <article class="card">
      <h3>再現性を高められる</h3>
      <p><code>uv.lock</code> に解決済みの依存関係を記録できます。チーム開発や別PCでの再セットアップ時に、同じ依存関係へそろえやすくなります。</p>
    </article>
  </div>
</section>

<section id="mental-model" data-search-section>
  <h2>3. まず押さえるファイル</h2>
  <p class="lead">uvのプロジェクトでは、<code>pyproject.toml</code>、<code>.venv</code>、<code>uv.lock</code> の役割を分けて理解すると全体像が見えます。</p>

  <table>
    <thead>
      <tr><th>名前</th><th>何を持つか</th><th>Git管理</th><th>初心者向けの理解</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>pyproject.toml</code></td>
        <td>プロジェクト名、Pythonバージョン条件、依存関係など</td>
        <td>管理する</td>
        <td>「このプロジェクトの設計書」</td>
      </tr>
      <tr>
        <td><code>.venv</code></td>
        <td>実際にライブラリが入る仮想環境</td>
        <td>管理しない</td>
        <td>「このプロジェクト専用のPython環境」</td>
      </tr>
      <tr>
        <td><code>uv.lock</code></td>
        <td>解決済みの正確なパッケージバージョン</td>
        <td>管理する</td>
        <td>「同じ環境を再現するための記録」</td>
      </tr>
      <tr>
        <td><code>.python-version</code></td>
        <td>そのディレクトリで使うPythonバージョン</td>
        <td>管理することが多い</td>
        <td>「このプロジェクトで使うPythonの目印」</td>
      </tr>
    </tbody>
  </table>

  <div class="diagram">
    <pre class="mermaid">
flowchart TD
  Init["uv init"] --> Py["pyproject.toml"]
  Init --> Ver[".python-version"]
  Add["uv add requests"] --> Py
  Run["uv run main.py"] --> Venv[".venv"]
  Run --> Lock["uv.lock"]
  Sync["uv sync"] --> Venv
  Lock --> Sync
    </pre>
  </div>
</section>

<section id="install" data-search-section>
  <h2>4. インストールと確認</h2>
  <p class="lead">Windowsでは公式のPowerShell用インストーラーが用意されています。macOSやLinuxではシェルスクリプト、Homebrew、pipなど複数の方法があります。</p>

  <h3>Windows</h3>
  <pre><code class="language-powershell">powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"</code></pre>

  <h3>macOS / Linux</h3>
  <pre><code class="language-bash">curl -LsSf https://astral.sh/uv/install.sh | sh</code></pre>

  <h3>インストール確認</h3>
  <pre><code class="language-bash">uv --version
uv help</code></pre>

  <div class="note">
    <strong>Windowsで詰まったら:</strong> インストール後に <code>uv</code> コマンドが見つからない場合は、ターミナルを開き直すか、PATHが反映されているかを確認します。
  </div>
</section>

<section id="first-project" data-search-section>
  <h2>5. 最初のプロジェクトを作る</h2>
  <p class="lead">uvの基本形は、作成、追加、実行、同期です。まずはこの4つだけで十分です。</p>

  <h3>新しいプロジェクトを作る</h3>
  <pre><code class="language-bash">uv init hello-uv
cd hello-uv</code></pre>

  <p><code>uv init</code> を実行すると、<code>pyproject.toml</code> やサンプルの <code>main.py</code> などが作られます。</p>

  <h3>プログラムを実行する</h3>
  <pre><code class="language-bash">uv run main.py</code></pre>

  <p><code>uv run</code> は、プロジェクトの環境を確認し、必要なら <code>.venv</code> や <code>uv.lock</code> を用意してからコマンドを実行します。</p>

  <h3>ライブラリを追加する</h3>
  <pre><code class="language-bash">uv add requests</code></pre>

  <p>依存関係は <code>pyproject.toml</code> に追加され、実際の解決結果は <code>uv.lock</code> に記録されます。手で <code>pip install</code> するよりも、プロジェクトの状態がファイルに残りやすいのが利点です。</p>

  <h3>依存関係を同期する</h3>
  <pre><code class="language-bash">uv sync</code></pre>

  <p>別PCでリポジトリを取得した後や、チームメンバーが依存関係を追加した後は <code>uv sync</code> で環境をそろえます。</p>
</section>

<section id="commands" data-search-section>
  <h2>6. よく使うコマンド一覧</h2>
  <p class="lead">最初からすべて覚える必要はありません。日常的にはプロジェクト系コマンドを中心に使います。</p>

  <table>
    <thead>
      <tr><th>やりたいこと</th><th>コマンド</th><th>使う場面</th></tr>
    </thead>
    <tbody>
      <tr><td>プロジェクト作成</td><td><code>uv init my-app</code></td><td>新しくPythonプロジェクトを始める</td></tr>
      <tr><td>依存関係を追加</td><td><code>uv add pandas</code></td><td>ライブラリをプロジェクトに入れる</td></tr>
      <tr><td>依存関係を削除</td><td><code>uv remove pandas</code></td><td>不要なライブラリを外す</td></tr>
      <tr><td>コマンド実行</td><td><code>uv run python main.py</code></td><td>プロジェクト環境でPythonを動かす</td></tr>
      <tr><td>環境同期</td><td><code>uv sync</code></td><td><code>uv.lock</code> に合わせて <code>.venv</code> を整える</td></tr>
      <tr><td>ロックファイル更新</td><td><code>uv lock</code></td><td>依存関係の解決結果を明示的に更新する</td></tr>
      <tr><td>依存関係ツリー確認</td><td><code>uv tree</code></td><td>どのライブラリが何に依存しているか見る</td></tr>
      <tr><td>Pythonを入れる</td><td><code>uv python install 3.12</code></td><td>指定バージョンのPythonを用意する</td></tr>
      <tr><td>Pythonを固定</td><td><code>uv python pin 3.12</code></td><td>プロジェクトで使うPythonバージョンを指定する</td></tr>
      <tr><td>一時的にツール実行</td><td><code>uvx ruff check .</code></td><td>ruffなどのCLIを一回だけ使う</td></tr>
    </tbody>
  </table>
</section>

<section id="pip-venv" data-search-section>
  <h2>7. pip・venvとの違い</h2>
  <p class="lead">uvはpipやvenvを否定するというより、よく使う作業をまとめて扱いやすくする道具です。</p>

  <table>
    <thead>
      <tr><th>従来の考え方</th><th>uvでの考え方</th><th>ポイント</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>python -m venv .venv</code></td>
        <td><code>uv run</code> または <code>uv sync</code></td>
        <td>必要に応じてプロジェクト環境を作成・同期する</td>
      </tr>
      <tr>
        <td><code>pip install requests</code></td>
        <td><code>uv add requests</code></td>
        <td>依存関係を <code>pyproject.toml</code> に残す</td>
      </tr>
      <tr>
        <td><code>pip freeze &gt; requirements.txt</code></td>
        <td><code>uv.lock</code></td>
        <td>解決済みバージョンをロックファイルに記録する</td>
      </tr>
      <tr>
        <td><code>pipx run ruff</code></td>
        <td><code>uvx ruff</code></td>
        <td>CLIツールを一時環境で実行できる</td>
      </tr>
    </tbody>
  </table>

  <div class="note">
    <strong>注意:</strong> uvには <code>uv pip install</code> のようなpip互換インターフェースもあります。ただし、新しいuvプロジェクトでは、まず <code>uv add</code>、<code>uv remove</code>、<code>uv sync</code>、<code>uv run</code> を使うほうが、プロジェクト管理としては分かりやすいです。
  </div>
</section>

<section id="workflow" data-search-section>
  <h2>8. 実務での基本ワークフロー</h2>
  <p class="lead">個人開発でもチーム開発でも、依存関係をファイルに残し、実行時はuvに環境をそろえてもらう流れが基本です。</p>

  <h3>新規プロジェクト</h3>
  <pre><code class="language-bash">uv init my-app
cd my-app
uv python pin 3.12
uv add fastapi
uv add --dev pytest
uv run python main.py</code></pre>

  <h3>既存プロジェクトを取得した後</h3>
  <pre><code class="language-bash">git clone https://example.com/my-app.git
cd my-app
uv sync
uv run pytest</code></pre>

  <h3>一時的にツールを実行する</h3>
  <pre><code class="language-bash">uvx ruff check .
uvx black .</code></pre>

  <p><code>uvx</code> は <code>uv tool run</code> の短い別名です。プロジェクトに依存関係として追加するほどではないCLIツールを、さっと実行したいときに便利です。</p>
</section>

<section id="lock-sync" data-search-section>
  <h2>9. lockとsyncの考え方</h2>
  <p class="lead">uvでは、依存関係を「解決する」ことと「環境へ入れる」ことを分けて考えます。</p>

  <div class="grid two">
    <article class="card">
      <h3>lock</h3>
      <p><code>uv lock</code> は、<code>pyproject.toml</code> に書かれた依存関係を解決して、具体的なバージョンを <code>uv.lock</code> に記録します。</p>
    </article>
    <article class="card">
      <h3>sync</h3>
      <p><code>uv sync</code> は、<code>uv.lock</code> の内容に合わせて、プロジェクトの <code>.venv</code> を更新します。</p>
    </article>
  </div>

  <p>公式ドキュメントでは、<code>uv run</code> のようなコマンドは実行前に自動でlockとsyncを行い、環境を最新状態に保つと説明されています。普段は自動に任せてもよいですが、CIやチーム開発では <code>uv sync</code> を明示すると状態をそろえやすいです。</p>

  <pre><code class="language-bash">uv lock
uv sync
uv run pytest</code></pre>
</section>

<section id="when-to-use" data-search-section>
  <h2>10. どんな人に向いているか</h2>
  <p class="lead">uvは、これからPython開発を始める人にも、既存のpip/venv運用を軽くしたい人にも向いています。</p>

  <table>
    <thead>
      <tr><th>状況</th><th>uvを使うメリット</th><th>まず覚えるコマンド</th></tr>
    </thead>
    <tbody>
      <tr><td>Python入門中</td><td>仮想環境と依存関係をまとめて扱える</td><td><code>uv init</code>、<code>uv add</code>、<code>uv run</code></td></tr>
      <tr><td>データ分析</td><td>pandasやjupyter周辺の依存関係を再現しやすい</td><td><code>uv add</code>、<code>uv sync</code></td></tr>
      <tr><td>Web API開発</td><td>FastAPI、pytest、ruffなどをプロジェクト単位で管理しやすい</td><td><code>uv add --dev</code>、<code>uv run</code></td></tr>
      <tr><td>CLIツール利用</td><td>プロジェクトに入れずに一時実行できる</td><td><code>uvx</code>、<code>uv tool install</code></td></tr>
      <tr><td>チーム開発</td><td><code>uv.lock</code> で環境差分を減らせる</td><td><code>uv sync</code>、<code>uv lock</code></td></tr>
    </tbody>
  </table>
</section>

<section id="pitfalls" data-search-section>
  <h2>11. 初心者がつまずきやすい点</h2>
  <p class="lead">uvは便利ですが、pipと同じ感覚で使いすぎると、プロジェクト管理の利点を逃すことがあります。</p>

  <div class="grid">
    <article class="card">
      <h3><code>uv pip install</code> から始めない</h3>
      <p>pip互換インターフェースは便利ですが、uvプロジェクトでは <code>uv add</code> を使うほうが依存関係を管理しやすいです。</p>
    </article>
    <article class="card">
      <h3><code>.venv</code> はGitに入れない</h3>
      <p>仮想環境は再作成できる作業用ディレクトリです。共有するのは <code>pyproject.toml</code> と <code>uv.lock</code> です。</p>
    </article>
    <article class="card">
      <h3>lockは自動更新される</h3>
      <p><code>uv run</code> は必要に応じてロックと同期を行います。意図せずlockが変わった場合は、依存関係の変更が入っていないか確認します。</p>
    </article>
  </div>
</section>

<section id="summary" data-search-section>
  <h2>12. まとめ</h2>
  <p class="lead">uvは、Python開発の「環境構築が面倒」「何をGitに入れるのか分からない」「pipとvenvの組み合わせで迷う」を減らすための強力な入口です。</p>

  <table>
    <thead>
      <tr><th>覚える順番</th><th>コマンド</th><th>意味</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td><code>uv init</code></td><td>プロジェクトを作る</td></tr>
      <tr><td>2</td><td><code>uv add</code></td><td>ライブラリを追加する</td></tr>
      <tr><td>3</td><td><code>uv run</code></td><td>プロジェクト環境で実行する</td></tr>
      <tr><td>4</td><td><code>uv sync</code></td><td>環境をロックファイルに合わせる</td></tr>
      <tr><td>5</td><td><code>uvx</code></td><td>CLIツールを一時実行する</td></tr>
    </tbody>
  </table>

  <div class="note">
    <strong>このページのゴール:</strong> uvを「速いpip」としてだけ見るのではなく、Pythonプロジェクトを作って、依存関係を記録し、同じ環境を再現するための総合ツールとして理解することです。
  </div>
</section>

<section id="sources" data-search-section>
  <h2>参考ソース</h2>
  <ul>
    <li><a href="https://docs.astral.sh/uv/">uv公式ドキュメント: Introduction</a></li>
    <li><a href="https://docs.astral.sh/uv/getting-started/features/">uv公式ドキュメント: Features</a></li>
    <li><a href="https://docs.astral.sh/uv/guides/projects/">uv公式ドキュメント: Working on projects</a></li>
    <li><a href="https://docs.astral.sh/uv/concepts/projects/layout/">uv公式ドキュメント: Project structure and files</a></li>
    <li><a href="https://docs.astral.sh/uv/concepts/projects/sync/">uv公式ドキュメント: Locking and syncing</a></li>
    <li><a href="https://docs.astral.sh/uv/reference/cli/">uv公式ドキュメント: CLI Reference</a></li>
    <li><a href="https://github.com/astral-sh/uv">astral-sh/uv GitHubリポジトリ</a></li>
  </ul>
</section>
