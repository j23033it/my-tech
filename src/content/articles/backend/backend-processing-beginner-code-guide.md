---
title: "卒論のルールベースアルゴリズム"
description: "URL取得、HTML解析、本文根拠探索、差分判定、結果整形まで、卒論で扱うニュース見出し誇張検出システムのルールベースアルゴリズムをPython初学者向けに読み解く。"
category: "バックエンド"
categorySlug: "backend"
tags: ["Python", "バックエンド", "Webスクレイピング", "自然言語処理", "コード解説"]
level: "beginner"
updated: "2026-06-03"
draft: false
---

<p class="lead">卒論で扱うニュース見出し誇張検出システムのルールベースアルゴリズムを、URL取得、HTML解析、根拠文探索、差分判定、結果整形という順番で読み解く記事です。Pythonを学び始めた段階でも追えるように、各ファイルの役割と実コードの読み方を対応づけて整理します。</p>

## 卒論のルールベースアルゴリズム

## このドキュメントの目的

このドキュメントは、ニュース見出し誇張検出システムのうち、フロントエンド画面を除いたバックエンド処理を、Pythonを学び始めた人でも追えるように説明するものです。

ここでいうバックエンド処理とは、主に次の処理です。

1. 入力されたURLから記事HTMLを取得する。
2. HTMLから記事タイトル、本文、公開日、媒体名を取り出す。
3. 記事タイトルを「見出し」として扱い、本文中の根拠文を探す。
4. 見出し側の表現の強さと、本文側の根拠の強さを比べる。
5. 差分を集約して、最終判定を作る。
6. 画面表示やMarkdown出力に使いやすい形へ整える。

注意点として、現在のリポジトリには、検索エンジンなどでURLを探す処理はありません。実装されているのは、ユーザーが入力したURLを直接取得して分析する処理です。

また、本システムは「誇張している」と断定するためのものではありません。本文の根拠に対して見出しが強い印象を与えている可能性を可視化する、研究・実験用の支援ツールです。

## 全体の処理フロー

URL入力から結果出力までの大きな流れは次のとおりです。

```text
ユーザーがURLを入力
        ↓
src/analyzer.py の analyze_url()
        ↓
src/config.py の load_settings()
        ↓
src/article_fetcher.py の fetch_html()
        ↓
src/article_parser.py の parse_article()
        ↓
src/analyzer.py の analyze_article()
        ↓
src/evidence_rules.py の analyze_claim_evidence()
        ↓
src/classifier.py の classify()
        ↓
AnalysisResult に結果をまとめる
        ↓
app.py や scripts/analyze_local_article.py が結果を表示・保存する
```

同じ流れを図にすると、次のようになります。最初は関数名を全部覚えるより、「取得」「抽出」「比較」「判定」「表示」の5段階で見ると追いやすいです。

<div class="diagram">
<pre class="mermaid">
flowchart TD
  U["ユーザーがURLを入力"] --> A["analyze_url()\n全体処理の入口"]
  A --> S["load_settings()\n取得設定を読む"]
  S --> F["fetch_html()\nURLを検証してHTMLを取得"]
  F --> P["parse_article()\nHTMLから記事情報を抽出"]
  P --> AR["analyze_article()\n取得済み記事を分析へ渡す"]
  AR --> E["analyze_claim_evidence()\n見出しと本文根拠を比較"]
  E --> C["classify()\n差分一覧から最終判定"]
  C --> R["AnalysisResult\n画面表示・Markdown出力用に集約"]

  classDef input fill:#e8f5f0,stroke:#27745d,color:#123b30;
  classDef process fill:#eef4ff,stroke:#3f64a8,color:#182f5f;
  classDef result fill:#fff2e5,stroke:#b45f06,color:#5f2f00;
  class U input;
  class A,S,F,P,AR,E,C process;
  class R result;
</pre>
</div>

| 段階 | 主な関数・ファイル | 入力 | 出力 | 初心者が見るポイント |
|---|---|---|---|---|
| 取得 | `fetch_html()` / `src/article_fetcher.py` | URL | HTML文字列 | URL形式、HTTPエラー、文字コード |
| 抽出 | `parse_article()` / `src/article_parser.py` | HTML文字列 | `Article` | タイトル・本文・日付・媒体名の取り出し |
| 分析 | `analyze_claim_evidence()` / `src/evidence_rules.py` | 見出し、本文 | `ClaimEvidence` と `Difference` | 主張候補、対応文、表現強度、根拠強度 |
| 判定 | `classify()` / `src/classifier.py` | 差分一覧 | 判定ラベル、理由 | 強い差分・中程度の差分の数え方 |
| 表示 | `ui_helpers.py` やCLI | `AnalysisResult` | 表示用の行データ、Markdown | 内部データを人が読める形へ変換 |

各ファイルの役割は次のとおりです。

| ファイル | 主な役割 |
|---|---|
| `src/analyzer.py` | 処理全体を順番につなぐ入口 |
| `src/config.py` | `.env` などから設定を読み込む |
| `src/article_fetcher.py` | URLを検証し、記事HTMLを取得する |
| `src/article_parser.py` | HTMLから記事情報を抽出する |
| `src/local_article_loader.py` | ローカルMarkdown記事を読み込む |
| `src/evidence_rules.py` | 本文根拠探索、主張候補抽出、差分生成の中心 |
| `src/preprocess.py` | テキスト正規化、重要語、名詞句などの抽出 |
| `src/morphological_analyzer.py` | SudachiPyで日本語を単語に分ける |
| `src/rule_patterns.py` | 判定に使うキーワードや正規表現を置く |
| `src/classifier.py` | 差分一覧から最終判定を決める |
| `src/models.py` | 記事、差分、分析結果などのデータ構造を定義する |
| `src/ui_helpers.py` | 分析結果を表形式に整える |
| `scripts/save_url_article.py` | URL記事を実験用Markdownとして保存する |
| `scripts/analyze_local_article.py` | 保存済みMarkdownを分析し、結果Markdownを出力する |

## まず理解したい4つのデータ

このプロジェクトでは、処理の途中で辞書や文字列をそのままバラバラに渡すのではなく、`src/models.py` に定義されたデータの形にまとめています。

初心者のうちは、まず次の4つを押さえると流れを追いやすいです。

| データ | 意味 |
|---|---|
| `Article` | 1本の記事。URL、タイトル、本文、公開日、媒体名を持つ |
| `ClaimEvidence` | 見出しから取り出した1つの主張候補と、それに対応する本文根拠 |
| `Difference` | 見出しと本文根拠の間に見つかった差分 |
| `AnalysisResult` | 最終的な分析結果の全部入りデータ |

4つのデータは、次の順番で作られていきます。

<div class="diagram">
<pre class="mermaid">
flowchart LR
  Raw["URL / ローカルMarkdown"] --> Article["Article\n記事1本分の情報"]
  Article --> Claim["ClaimEvidence\n主張候補ごとの根拠探索結果"]
  Claim --> Diff["Difference\n判定に使う差分だけを抽出"]
  Article --> Result["AnalysisResult\n最終結果の全部入り"]
  Claim --> Result
  Diff --> Result

  classDef source fill:#f4f4f5,stroke:#71717a,color:#27272a;
  classDef data fill:#e8f5f0,stroke:#27745d,color:#123b30;
  classDef result fill:#fff2e5,stroke:#b45f06,color:#5f2f00;
  class Raw source;
  class Article,Claim,Diff data;
  class Result result;
</pre>
</div>

| データ | 作られる主な場所 | 次に使われる場所 | 役割のイメージ |
|---|---|---|---|
| `Article` | `parse_article()`、`parse_local_article_markdown()` | `analyze_article()` | 記事を分析に渡すための共通フォーマット |
| `ClaimEvidence` | `analyze_single_claim()` | 画面表示、差分生成 | 主張候補ごとの詳しい途中結果 |
| `Difference` | `analyze_claim_evidence()` | `classify()`、表示用テーブル | 最終判定に使う注意点 |
| `AnalysisResult` | `analyze_article()` | `app.py`、CLI、Markdown出力 | 画面や保存処理に渡す完成データ |

該当する実コードは次の部分です。

```python
class Article(BaseModel):
    url: str
    title: str
    body: str
    published_date: str | None = None
    source_name: str | None = None
```

`Article` は、記事1本分の情報です。`title` が見出しとして使われ、`body` が本文根拠探索の対象になります。

```python
class ClaimEvidence(BaseModel):
    # 見出しから抽出した1つの主張候補と、本文中の根拠文候補を対応づけた結果。
    claim_text: str
    matched_text: str = ""
    support_score: float = 0.0
    important_terms: list[str] = Field(default_factory=list)
    matched_terms: list[str] = Field(default_factory=list)
    evidence_strength: EvidenceStrength = EvidenceStrength.NONE
    headline_strength: HeadlineExpressionStrength = HeadlineExpressionStrength.WEAK
    difference_strength: DifferenceStrength | None = None
    difference_kind: str = "差分なし"
    reason: str = ""
```

`ClaimEvidence` は、「見出しの中のこの主張に対して、本文のこの文が対応していそう」という分析結果です。

```python
class Difference(BaseModel):
    # 1つの比較観点で検出された、見出し側と本文側の表現差分。
    kind: str
    strength: DifferenceStrength
    headline_expression: str
    summary_expression: str
    reason: str
```

`Difference` は、差分だけを取り出したデータです。最終判定では、この差分の強さを数えます。

```python
class AnalysisResult(BaseModel):
    # 分析完了後に画面へ渡す全情報をまとめた結果オブジェクト。
    article: Article
    summary: ArticleSummary = Field(default_factory=ArticleSummary)
    judgment: JudgmentLabel
    reason: str
    differences: list[Difference] = Field(default_factory=list)
    claim_analyses: list[ClaimEvidence] = Field(default_factory=list)
```

`AnalysisResult` は、画面や結果Markdownに渡す最終結果です。

## 全体制御: `src/analyzer.py`

バックエンド処理の入口は `src/analyzer.py` です。ここには、細かい判定ロジックはほとんど書かれていません。代わりに、別ファイルの関数を順番に呼び出して処理をつなぎます。

実コードは次のとおりです。

```python
from __future__ import annotations

from src.article_fetcher import fetch_html
from src.article_parser import parse_article
from src.classifier import classify
from src.config import load_settings
from src.evidence_rules import analyze_claim_evidence
from src.local_article_loader import parse_local_article_markdown
from src.models import AnalysisResult, Article


def analyze_url(url: str) -> AnalysisResult:
    # URL分析の入口として、取得から判定までの各責務を順番に接続する。
    settings = load_settings()
    html = fetch_html(url, settings)
    article = parse_article(url, html)
    return analyze_article(article)


def analyze_local_markdown(markdown_text: str, *, source_id: str) -> AnalysisResult:
    # 画面やCLIから受け取ったローカルMarkdown記事を、既存の判定フローへ流す。
    article, _metadata = parse_local_article_markdown(markdown_text, source_id=source_id)
    return analyze_article(article)


def analyze_article(article: Article) -> AnalysisResult:
    # 実験用のローカル記事など、取得済みの記事情報を既存の判定フローに流す入口。
    claim_analyses, differences = analyze_claim_evidence(article.title, article.body)
    judgment, reason = classify(differences)
    return AnalysisResult(
        article=article,
        judgment=judgment,
        reason=reason,
        differences=differences,
        claim_analyses=claim_analyses,
    )
```

### `analyze_url()` の読み方

```python
settings = load_settings()
```

最初に設定を読み込みます。ここでは、記事取得時のタイムアウト秒数などを使います。

```python
html = fetch_html(url, settings)
```

入力されたURLへアクセスし、HTML文字列を取得します。

```python
article = parse_article(url, html)
```

HTMLから記事タイトルや本文を取り出し、`Article` に変換します。

```python
return analyze_article(article)
```

取得済みの記事を、分析処理へ渡します。

### `analyze_article()` の読み方

```python
claim_analyses, differences = analyze_claim_evidence(article.title, article.body)
```

ここで本文根拠探索を行います。戻り値は2つです。

| 戻り値 | 意味 |
|---|---|
| `claim_analyses` | 主張候補ごとの詳しい分析結果 |
| `differences` | 最終判定に使う差分一覧 |

```python
judgment, reason = classify(differences)
```

差分一覧を使って、最終判定と判定理由を作ります。

```python
return AnalysisResult(...)
```

最後に、記事情報、判定、理由、差分、主張ごとの分析結果を1つにまとめます。

## 設定読み込み: `src/config.py`

`src/config.py` は、設定値を読み込むファイルです。

実コードは次のとおりです。

```python
from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass(frozen=True)
class Settings:
    # 画面・取得・要約で共有する設定値。環境変数の読み取りはload_settingsに集約する。
    gemini_api_key: str | None
    gemini_model: str
    request_timeout_seconds: int
    article_max_chars: int


def load_settings() -> Settings:
    # .envを読み込んだうえで、未指定時は初期プロトタイプ用の既定値を使う。
    load_dotenv()
    return Settings(
        gemini_api_key=os.getenv("GEMINI_API_KEY"),
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite"),
        request_timeout_seconds=int(os.getenv("REQUEST_TIMEOUT_SECONDS", "15")),
        # 0は本文短縮なし。必要になった時だけ.envで上限文字数を指定する。
        article_max_chars=int(os.getenv("ARTICLE_MAX_CHARS", "0")),
    )
```

`@dataclass(frozen=True)` は、設定値をまとめるための書き方です。`frozen=True` なので、作った後に値を書き換えない前提になります。

現在の主判定フローでは、Gemini APIは使いません。`gemini_api_key` や `gemini_model` は、過去方式または補助要約用として残っています。

URL取得で直接使われるのは、主に次の値です。

```python
request_timeout_seconds=int(os.getenv("REQUEST_TIMEOUT_SECONDS", "15"))
```

これは、記事ページを取得するときに何秒まで待つかを表します。

## URLからHTMLを取得する: `src/article_fetcher.py`

`src/article_fetcher.py` は、URLからHTMLを取ってくる担当です。

実コードは次のとおりです。

```python
from __future__ import annotations

from urllib.parse import urlparse

from bs4 import UnicodeDammit
import requests

from src.config import Settings
from src.models import AppError


def fetch_html(url: str, settings: Settings) -> str:
    # 記事取得前にURL形式を確認し、画面側へ出せる業務エラーに変換する。
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise AppError("有効なニュース記事URLを入力してください。")

    try:
        # User-Agentを明示し、ニュースサイト側で通常のHTTPクライアントとして扱われやすくする。
        response = requests.get(
            url,
            timeout=settings.request_timeout_seconds,
            headers={
                "User-Agent": "headline-exaggeration-detector/0.1 (+https://example.local)"
            },
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise AppError("記事ページを取得できませんでした。URLやサイトの公開状態を確認してください。") from exc

    return _decode_html_response(response)


def _decode_html_response(response: requests.Response) -> str:
    # 日本語ニュースサイトではHTTPヘッダーよりHTML内のcharset宣言が正しい場合がある。
    # response.textに任せる前に、本文バイト列からHTML向けの文字コード判定を行う。
    decoded = UnicodeDammit(response.content, is_html=True).unicode_markup
    if decoded:
        return decoded
    return response.text
```

### URL形式の確認

```python
parsed = urlparse(url)
if parsed.scheme not in {"http", "https"} or not parsed.netloc:
    raise AppError("有効なニュース記事URLを入力してください。")
```

`urlparse()` はURLを分解する関数です。たとえば、`https://example.com/news` なら、`scheme` は `https`、`netloc` は `example.com` になります。

このコードでは、次のようなURLをエラーにします。

| 入力例 | エラーになる理由 |
|---|---|
| `example.com/news` | `http` や `https` がない |
| `ftp://example.com/news` | `http` / `https` ではない |
| `https:///news` | ホスト名がない |

### HTML取得

```python
response = requests.get(
    url,
    timeout=settings.request_timeout_seconds,
    headers={
        "User-Agent": "headline-exaggeration-detector/0.1 (+https://example.local)"
    },
)
```

`requests.get()` は、指定したURLにアクセスしてレスポンスを受け取る関数です。

`timeout` は、応答を待つ最大秒数です。ずっと待ち続けないようにするために指定しています。

`User-Agent` は、「どんなプログラムがアクセスしているか」をサイト側へ伝えるHTTPヘッダーです。

### HTTPエラーの確認

```python
response.raise_for_status()
```

この行は、HTTPステータスがエラーの場合に例外を発生させます。たとえば、404 Not Found や 500 Internal Server Error などです。

### 文字コードの推定

```python
decoded = UnicodeDammit(response.content, is_html=True).unicode_markup
```

ニュースサイトのHTMLは、日本語の文字コード判定が難しい場合があります。`UnicodeDammit` を使うことで、HTML内の文字コード情報を見ながら、文字化けしにくい形で文字列へ変換しています。

## HTMLから記事情報を取り出す: `src/article_parser.py`

`src/article_parser.py` は、HTMLから記事タイトルや本文を取り出す担当です。

実コードは次のとおりです。

```python
from __future__ import annotations

import json

from bs4 import BeautifulSoup
import trafilatura

from src.models import AppError, Article


def parse_article(url: str, html: str) -> Article:
    # trafilaturaを主経路にして、本文・タイトル・メタ情報をまとめて抽出する。
    extracted = trafilatura.extract(
        html,
        output_format="json",
        with_metadata=True,
        include_comments=False,
        include_tables=False,
        favor_precision=True,
    )
    data: dict[str, str] = {}
    if extracted:
        try:
            data = json.loads(extracted)
        except json.JSONDecodeError:
            data = {}

    soup = BeautifulSoup(html, "html.parser")
    # 抽出ライブラリで欠けたメタ情報はHTMLタグから補完する。
    title = _clean_text(data.get("title")) or _extract_title(soup)
    body = _clean_text(data.get("text"))
    published_date = _clean_text(data.get("date")) or _meta_content(
        soup, ["article:published_time", "pubdate", "date"]
    )
    source_name = _clean_text(data.get("sitename")) or _meta_content(
        soup, ["og:site_name", "application-name"]
    )

    if not title:
        raise AppError("記事タイトルを抽出できませんでした。")
    if not body or len(body) < 80:
        # 短すぎる本文は、ログイン壁や抽出失敗を本文として扱わないためエラーにする。
        raise AppError("記事本文を抽出できませんでした。ログイン不要の公開記事URLか確認してください。")

    return Article(
        url=url,
        title=title,
        body=body,
        published_date=published_date,
        source_name=source_name,
    )
```

### `trafilatura.extract()` の役割

```python
extracted = trafilatura.extract(
    html,
    output_format="json",
    with_metadata=True,
    include_comments=False,
    include_tables=False,
    favor_precision=True,
)
```

`trafilatura` は、HTMLから本文らしい部分を取り出すライブラリです。ニュースサイトのHTMLには、広告、関連記事、ナビゲーション、コメント欄など、分析には不要な部分が多く含まれます。`trafilatura` は、それらを除いて本文を抽出するために使われています。

指定している主なオプションは次のとおりです。

| オプション | 意味 |
|---|---|
| `output_format="json"` | 抽出結果をJSON文字列で返す |
| `with_metadata=True` | タイトル、日付、サイト名なども取る |
| `include_comments=False` | コメント欄を含めない |
| `include_tables=False` | 表を含めない |
| `favor_precision=True` | 余計な文章を入れにくくする |

### JSON文字列をPythonの辞書へ変換

```python
data = json.loads(extracted)
```

`json.loads()` は、JSON文字列をPythonの辞書に変換します。

たとえば、次のようなJSON文字列があったとします。

```json
{"title": "記事タイトル", "text": "記事本文"}
```

`json.loads()` を使うと、Pythonでは次のように扱えるようになります。

```python
data["title"]
data["text"]
```

### BeautifulSoupで補完する理由

```python
soup = BeautifulSoup(html, "html.parser")
title = _clean_text(data.get("title")) or _extract_title(soup)
```

`trafilatura` だけで必ず全情報が取れるとは限りません。そのため、タイトルや媒体名などが取れなかった場合は、HTMLタグを直接見て補完します。

たとえば、`_extract_title()` は次の順番でタイトルを探します。

```python
def _extract_title(soup: BeautifulSoup) -> str:
    # OGP、titleタグ、h1の順に、ニュース記事の見出しらしい値を探す。
    og_title = _meta_content(soup, ["og:title", "twitter:title"])
    if og_title:
        return og_title
    if soup.title and soup.title.string:
        return _clean_text(soup.title.string)
    heading = soup.find("h1")
    return _clean_text(heading.get_text(" ", strip=True)) if heading else ""
```

探索順は次のとおりです。

1. OGPタグやTwitterカード用のタイトル
2. HTMLの `<title>` タグ
3. ページ内の `<h1>` タグ

### 本文が短すぎる場合

```python
if not body or len(body) < 80:
    raise AppError("記事本文を抽出できませんでした。ログイン不要の公開記事URLか確認してください。")
```

本文が空、または80文字未満の場合は、抽出失敗として扱います。ログインが必要な記事や有料記事では、本文ではなく案内文だけが取れることがあるためです。

## ローカルMarkdownを読み込む: `src/local_article_loader.py`

URLではなく、保存済みMarkdownから分析するルートもあります。

実験用Markdownは、次のような形を想定しています。

```markdown
---
title: "記事タイトル"
headline_type: "普通見出し"
expected_label: "整合"
source_name: "媒体名"
published_date: "2026-06-03"
original_url: "https://example.com/news/article"
---

ここに本文を書く。
```

実コードは次のとおりです。

```python
def load_local_article(path: Path, *, require_experiment_labels: bool = False) -> tuple[Article, dict[str, str]]:
    if not path.exists():
        raise AppError(f"Markdownファイルが見つかりません: {path}")
    if path.suffix.lower() != ".md":
        raise AppError("ローカル記事はMarkdownファイル（.md）で指定してください。")

    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise AppError("MarkdownファイルはUTF-8で保存してください。") from exc

    return parse_local_article_markdown(
        text,
        source_id=path.stem,
        require_experiment_labels=require_experiment_labels,
    )
```

この関数は、まずファイルの存在と拡張子を確認します。その後、UTF-8として読み込みます。

```python
def parse_local_article_markdown(
    text: str,
    *,
    source_id: str,
    require_experiment_labels: bool = False,
) -> tuple[Article, dict[str, str]]:
    metadata, body = parse_front_matter(text)
    validate_metadata(metadata, require_experiment_labels=require_experiment_labels)
    body = body.strip()
    if not body:
        raise AppError("本文が空です。フロントマターの下に本文を書いてください。")

    article = Article(
        url=metadata.get("original_url") or f"local://{source_id}",
        title=metadata["title"],
        body=body,
        source_name=metadata.get("source_name", "ローカルMarkdown"),
        published_date=metadata.get("published_date"),
    )
    return article, metadata
```

`parse_local_article_markdown()` は、Markdownのフロントマターと本文を分け、最後に `Article` を作ります。

## 本文根拠探索の中心: `src/evidence_rules.py`

現在の主判定ロジックの中心は `src/evidence_rules.py` です。

ここで行っていることは、大きく分けると次の6つです。

1. 本文を短い単位に分割する。
2. 見出しから主張候補を取り出す。
3. 主張候補ごとに、本文中の対応文を探す。
4. 本文側の根拠強度を判定する。
5. 見出し側の表現強度を判定する。
6. 両者を比較して差分を作る。

この6つを、1つの主張候補に注目して図にすると次のようになります。

<div class="diagram">
<pre class="mermaid">
flowchart TD
  H["見出し"] --> HC["extract_headline_claims()\n主張候補を取り出す"]
  B["本文"] --> BU["split_body_units()\n本文を短い単位へ分ける"]
  HC --> AS["analyze_single_claim()\n主張候補を1つずつ分析"]
  BU --> AS
  AS --> CS["correspondence_score()\n対応度と一致語を計算"]
  CS --> ES["classify_evidence_strength()\n本文側の根拠強度"]
  AS --> HS["classify_headline_strength()\n見出し側の表現強度"]
  ES --> CMP["compare_strengths()\n見出しと本文根拠を比較"]
  HS --> CMP
  CMP --> D["Difference\n差分ありなら作成"]
  AS --> CE["ClaimEvidence\n途中結果も保存"]

  classDef text fill:#f4f4f5,stroke:#71717a,color:#27272a;
  classDef logic fill:#eef4ff,stroke:#3f64a8,color:#182f5f;
  classDef output fill:#fff2e5,stroke:#b45f06,color:#5f2f00;
  class H,B text;
  class HC,BU,AS,CS,ES,HS,CMP logic;
  class D,CE output;
</pre>
</div>

| 処理 | 何を見るか | 何を決めるか |
|---|---|---|
| 主張候補抽出 | 見出し内の引用、数値、強い語、末尾表現 | 本文と照合する単位 |
| 本文分割 | 段落、文末記号、長すぎる段落 | 比較対象にする本文文 |
| 対応度計算 | 重要語の一致、数値一致、語の近さ | 一番対応していそうな本文文 |
| 根拠強度判定 | 確定表現、公式情報、弱い推測表現 | 本文側の根拠の強さ |
| 見出し強度判定 | 強い見出し語、中程度表現、弱い表現 | 見出し側の表現の強さ |
| 差分生成 | 見出し強度と根拠強度の組み合わせ | 注意点として出す差分 |

### 入口: `analyze_claim_evidence()`

実コードは次のとおりです。

```python
def analyze_claim_evidence(headline: str, body: str) -> tuple[list[ClaimEvidence], list[Difference]]:
    body_units = split_body_units(body)
    claims = extract_headline_claims(headline)
    analyses = [analyze_single_claim(claim, body_units) for claim in claims]
    differences = [
        Difference(
            kind=analysis.difference_kind,
            strength=analysis.difference_strength,
            headline_expression=analysis.claim_text,
            summary_expression=analysis.matched_text or "本文中に対応する根拠文なし",
            reason=analysis.reason,
        )
        for analysis in analyses
        if analysis.difference_strength is not None
    ]
    return analyses, differences
```

### 処理の順番

```python
body_units = split_body_units(body)
```

本文を文単位、または短い段落単位に分割します。あとで、見出しの主張候補と1つずつ比較します。

```python
claims = extract_headline_claims(headline)
```

見出しから主張候補を取り出します。見出し全体をそのまま使うだけではなく、引用符内の表現や末尾表現なども候補にします。

```python
analyses = [analyze_single_claim(claim, body_units) for claim in claims]
```

これはリスト内包表記です。通常の `for` 文で書くと、次のような意味です。

```python
analyses = []
for claim in claims:
    analysis = analyze_single_claim(claim, body_units)
    analyses.append(analysis)
```

つまり、主張候補を1つずつ分析しています。

```python
differences = [
    Difference(...)
    for analysis in analyses
    if analysis.difference_strength is not None
]
```

分析結果のうち、差分があるものだけを `Difference` として取り出しています。

### 本文を分割する: `split_body_units()`

```python
def split_body_units(body: str) -> list[str]:
    normalized = normalize_text(body).replace("\r\n", "\n").replace("\r", "\n")
    units: list[str] = []
    for paragraph in re.split(r"\n+", normalized):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        sentences = [match.group(0).strip() for match in _SENTENCE_PATTERN.finditer(paragraph)]
        if len(sentences) <= 1 and len(paragraph) > 120:
            sentences = [paragraph[index : index + 120].strip() for index in range(0, len(paragraph), 120)]
        units.extend(sentence for sentence in sentences if len(sentence) >= 8)
    return _unique_preserve_order(units)
```

この関数は、本文を比較しやすい単位に分けます。

```python
normalized = normalize_text(body).replace("\r\n", "\n").replace("\r", "\n")
```

まず、表記ゆれや改行コードを整えます。

```python
for paragraph in re.split(r"\n+", normalized):
```

本文を段落ごとに分けます。`re.split(r"\n+", ...)` は、1つ以上の改行で文字列を分割するという意味です。

```python
sentences = [match.group(0).strip() for match in _SENTENCE_PATTERN.finditer(paragraph)]
```

段落の中から文を取り出します。`_SENTENCE_PATTERN` は、句点や疑問符などを手がかりに文を探す正規表現です。

```python
if len(sentences) <= 1 and len(paragraph) > 120:
    sentences = [paragraph[index : index + 120].strip() for index in range(0, len(paragraph), 120)]
```

文としてうまく分けられず、段落が長すぎる場合は、120文字ずつに分けます。

### 見出しから主張候補を取り出す: `extract_headline_claims()`

```python
def extract_headline_claims(headline: str) -> list[str]:
    normalized = _strip_source_suffix(normalize_text(headline))
    candidates: list[str] = []

    candidates.extend(match.group(1).strip() for match in _QUOTE_PATTERN.finditer(normalized))

    chunks = [chunk for chunk in _CHUNK_SEPARATOR.split(normalized) if chunk]
    for chunk in chunks:
        if _looks_like_claim_chunk(chunk):
            candidates.append(chunk)

    tail = _tail_claim(normalized)
    if tail:
        candidates.append(tail)

    if not candidates:
        candidates.append(normalized)

    return _unique_preserve_order(_clean_claim(candidate) for candidate in candidates if candidate)
```

この関数は、見出しの中から「本文と照合したい主張っぽい部分」を探します。

主な手がかりは次のとおりです。

| 手がかり | 例 |
|---|---|
| 引用符の中 | 「引退か」「終了へ」 |
| 数値を含む部分 | `過去最多`, `30%増` |
| 因果や対比の表現 | `原因で`, `一方で` |
| 強い修飾語 | `衝撃の`, `深刻な` |
| 末尾の主張表現 | `〜か`, `〜へ`, `〜説`, `〜疑惑` |

### 1つの主張候補を分析する: `analyze_single_claim()`

```python
def analyze_single_claim(claim: str, body_units: list[str]) -> ClaimEvidence:
    important_terms = _important_terms(claim)
    best_text = ""
    best_score = 0.0
    best_terms: list[str] = []

    for unit in body_units:
        score, matched_terms = correspondence_score(claim, unit, important_terms)
        if score > best_score:
            best_score = score
            best_text = unit
            best_terms = matched_terms

    has_support = best_score >= MIN_SUPPORT_SCORE
    evidence_strength = (
        classify_evidence_strength(best_text, best_score, best_terms, important_terms)
        if has_support
        else EvidenceStrength.NONE
    )
    headline_strength = classify_headline_strength(claim)
    difference_strength, difference_kind = compare_strengths(headline_strength, evidence_strength)
    reason = build_reason(
        claim=claim,
        matched_text=best_text if has_support else "",
        headline_strength=headline_strength,
        evidence_strength=evidence_strength,
        difference_strength=difference_strength,
        score=best_score,
        matched_terms=best_terms,
    )

    return ClaimEvidence(
        claim_text=claim,
        matched_text=best_text if has_support else "",
        support_score=round(best_score, 3),
        important_terms=important_terms,
        matched_terms=best_terms,
        evidence_strength=evidence_strength,
        headline_strength=headline_strength,
        difference_strength=difference_strength,
        difference_kind=difference_kind,
        reason=reason,
    )
```

この関数は、1つの主張候補に対して、本文中で一番対応していそうな文を探します。

```python
important_terms = _important_terms(claim)
```

まず、主張候補から重要語を取り出します。

```python
best_text = ""
best_score = 0.0
best_terms: list[str] = []
```

これらは、今まで見た中で一番対応度が高い本文文を覚えておく変数です。

```python
for unit in body_units:
    score, matched_terms = correspondence_score(claim, unit, important_terms)
    if score > best_score:
        best_score = score
        best_text = unit
        best_terms = matched_terms
```

本文の各文について対応度を計算し、一番スコアが高い文を保存します。

```python
has_support = best_score >= MIN_SUPPORT_SCORE
```

`MIN_SUPPORT_SCORE` は、対応文ありとみなす最低点です。

```python
MIN_SUPPORT_SCORE = 0.34
```

スコアが0.34以上なら「本文中に対応する根拠文がある」と扱います。

### 対応度を計算する: `correspondence_score()`

```python
def correspondence_score(
    claim: str,
    body_unit: str,
    important_terms: list[str] | None = None,
) -> tuple[float, list[str]]:
    claim_terms = important_terms or _important_terms(claim)
    body_text = _canonical(body_unit)
    body_features = preprocess_text(body_unit)
    body_terms = {_canonical(term) for term in body_features.important_terms}
    matched_terms: list[str] = []

    for term in claim_terms:
        key = _canonical(term)
        if not key:
            continue
        if key in body_text or key in body_terms:
            matched_terms.append(term)

    if not claim_terms:
        direct_score = 1.0 if _canonical(claim) and _canonical(claim) in body_text else 0.0
        return direct_score, []

    coverage = len(matched_terms) / len(claim_terms)
    number_bonus = _number_bonus(claim, body_unit)
    phrase_bonus = 0.18 if _canonical(claim) and _canonical(claim) in body_text else 0.0
    proximity_bonus = _proximity_bonus(matched_terms, body_unit)
    score = min(1.0, coverage * 0.72 + number_bonus + phrase_bonus + proximity_bonus)
    return score, _unique_preserve_order(matched_terms)
```

この関数は、見出しの主張候補と本文の1文がどれくらい対応しているかを数値で返します。

対応度は、主に次の材料で決まります。

| 変数 | 意味 |
|---|---|
| `coverage` | 見出し側の重要語のうち、本文に出てきた割合 |
| `number_bonus` | 数値が一致した場合の加点 |
| `phrase_bonus` | 主張候補全体が本文に含まれる場合の加点 |
| `proximity_bonus` | 一致した重要語が本文中で近くにある場合の加点 |

```python
score = min(1.0, coverage * 0.72 + number_bonus + phrase_bonus + proximity_bonus)
```

最後に、スコアが最大1.0になるようにしています。

### 本文側の根拠強度を判定する

```python
def classify_evidence_strength(
    text: str,
    score: float,
    matched_terms: list[str],
    important_terms: list[str],
) -> EvidenceStrength:
    if not text or score < MIN_SUPPORT_SCORE:
        return EvidenceStrength.NONE
    if _contains_any(text, patterns.WEAK_EVIDENCE_WORDS):
        return EvidenceStrength.WEAK
    if _contains_any(text, patterns.OFFICIAL_SOURCE_WORDS) and _contains_any(text, patterns.CONFIRMED_FACT_WORDS):
        return EvidenceStrength.STRONG
    if _contains_any(text, patterns.CONFIRMED_FACT_WORDS):
        return EvidenceStrength.STRONG
    if patterns.NUMBER_PATTERN.search(text) and len(matched_terms) >= max(1, len(important_terms) // 2):
        return EvidenceStrength.STRONG
    if _contains_any(text, patterns.MEDIUM_EVIDENCE_WORDS):
        return EvidenceStrength.MEDIUM
    if score >= 0.72:
        return EvidenceStrength.MEDIUM
    return EvidenceStrength.WEAK
```

根拠強度は4段階です。

| 内部値 | 日本語の意味 |
|---|---|
| `EvidenceStrength.STRONG` | 強い根拠 |
| `EvidenceStrength.MEDIUM` | 中程度の根拠 |
| `EvidenceStrength.WEAK` | 弱い根拠 |
| `EvidenceStrength.NONE` | 根拠なし |

判定の考え方は次のとおりです。

1. 対応文がない、またはスコアが低いなら `根拠なし`。
2. 可能性や憶測などの弱い表現があれば `弱い根拠`。
3. 公式発表や確定表現があれば `強い根拠`。
4. 数値があり、重要語もある程度一致していれば `強い根拠`。
5. 関係者や専門家などの表現があれば `中程度の根拠`。
6. スコアが高ければ `中程度の根拠`。
7. それ以外は `弱い根拠`。

### 見出し側の表現強度を判定する

```python
def classify_headline_strength(claim: str) -> HeadlineExpressionStrength:
    if _contains_any(claim, patterns.HEADLINE_STRONG_WORDS):
        return HeadlineExpressionStrength.STRONG
    if _contains_any(claim, patterns.HEADLINE_WEAK_WORDS):
        return HeadlineExpressionStrength.WEAK
    if _contains_any(claim, patterns.HEADLINE_MEDIUM_WORDS):
        return HeadlineExpressionStrength.MEDIUM
    if claim.endswith(("か", "か?", "か？", "説", "疑惑")):
        return HeadlineExpressionStrength.MEDIUM
    return HeadlineExpressionStrength.WEAK
```

見出し側の表現強度は3段階です。

| 内部値 | 日本語の意味 |
|---|---|
| `HeadlineExpressionStrength.STRONG` | 強い見出し表現 |
| `HeadlineExpressionStrength.MEDIUM` | 中程度の見出し表現 |
| `HeadlineExpressionStrength.WEAK` | 弱い見出し表現 |

この関数は、`rule_patterns.py` にあるキーワードリストを使って判定します。

たとえば、見出しに `判明`、`確定`、`急増`、`危機` などが含まれていると、強い表現として扱われやすくなります。

### 見出しと本文根拠を比較する

```python
def compare_strengths(
    headline_strength: HeadlineExpressionStrength,
    evidence_strength: EvidenceStrength,
) -> tuple[DifferenceStrength | None, str]:
    if headline_strength == HeadlineExpressionStrength.STRONG and evidence_strength in {
        EvidenceStrength.NONE,
        EvidenceStrength.WEAK,
    }:
        return DifferenceStrength.STRONG, "見出し表現が本文根拠より強い"
    if headline_strength == HeadlineExpressionStrength.MEDIUM and evidence_strength == EvidenceStrength.NONE:
        return DifferenceStrength.STRONG, "見出し主張の本文根拠なし"
    if headline_strength == HeadlineExpressionStrength.MEDIUM and evidence_strength == EvidenceStrength.WEAK:
        return DifferenceStrength.MEDIUM, "見出し表現に対して本文根拠が弱い"
    return None, "差分なし"
```

比較ルールは次の表のようになります。

| 見出し側 | 本文側 | 差分 |
|---|---|---|
| 強い表現 | 根拠なし | 強い差分 |
| 強い表現 | 弱い根拠 | 強い差分 |
| 中程度の表現 | 根拠なし | 強い差分 |
| 中程度の表現 | 弱い根拠 | 中程度の差分 |
| その他 | その他 | 差分なし |

## テキスト前処理: `src/preprocess.py`

見出しと本文をそのまま比べると、表記ゆれの影響を受けます。そこで `src/preprocess.py` では、テキストを正規化し、重要語を取り出します。

重要な関数は `normalize_text()` と `preprocess_text()` です。

```python
def normalize_text(text: str) -> str:
    # 表記ゆれを抑えるため、全角英数や互換文字を正規化する。
    normalized = unicodedata.normalize("NFKC", text or "")
    return re.sub(r"\s+", " ", normalized).strip()
```

`unicodedata.normalize("NFKC", ...)` は、全角英数字や互換文字を標準的な形に寄せます。

たとえば、次のような違いを減らします。

| 元の文字 | 正規化後の例 |
|---|---|
| `ＡＢＣ` | `ABC` |
| `１２３` | `123` |
| 連続する空白や改行 | 1つの空白 |

```python
def preprocess_text(text: str) -> TextFeatures:
    normalized = normalize_text(text)
    tokens = _tokenize(normalized)
    noun_phrases = _extract_noun_phrases(tokens)
    predicates = _extract_matches(normalized, patterns.CLAIM_FORMING_PREDICATES)
    claim_markers = _extract_matches(normalized, patterns.CLAIM_MARKERS)

    important_terms = _unique_preserve_order(
        [
            *_extract_independent_terms(tokens),
            *noun_phrases,
            *predicates,
        ]
    )

    return TextFeatures(
        original_text=text or "",
        normalized_text=normalized,
        tokens=tokens,
        important_terms=important_terms,
        noun_phrases=noun_phrases,
        predicates=predicates,
        claim_markers=claim_markers,
    )
```

`preprocess_text()` は、1つのテキストから次の特徴を取り出します。

| 項目 | 意味 |
|---|---|
| `tokens` | 形態素解析で分けた単語 |
| `noun_phrases` | 名詞が連続した表現 |
| `predicates` | 判明、確定、崩壊などの主張を作る述語 |
| `claim_markers` | 可能性、疑い、限定などのマーカー |
| `important_terms` | 比較に使う重要語 |

## 形態素解析: `src/morphological_analyzer.py`

日本語は英語のように単語の間にスペースがありません。そのため、重要語を取り出すには、文章を単語に分ける必要があります。

この処理を形態素解析と呼びます。

実コードは次のとおりです。

```python
from __future__ import annotations

from functools import lru_cache

from sudachipy import SplitMode, dictionary

from src.models import TokenFeature


@lru_cache(maxsize=1)
def _tokenizer():
    return dictionary.Dictionary().create()


def tokenize_text(text: str) -> list[TokenFeature]:
    # SudachiPy固有の戻り値を、ルール判定で使う共通モデルへ変換する。
    tokens: list[TokenFeature] = []
    for index, morpheme in enumerate(_tokenizer().tokenize(text or "", SplitMode.C)):
        tokens.append(
            TokenFeature(
                surface=morpheme.surface(),
                base_form=morpheme.dictionary_form(),
                part_of_speech=",".join(morpheme.part_of_speech()),
                position=index,
            )
        )
    return tokens
```

`@lru_cache(maxsize=1)` は、一度作ったSudachiPyの辞書を再利用するための仕組みです。辞書の作成は重い処理なので、毎回作り直さないようにしています。

`TokenFeature` には、次の情報が入ります。

| フィールド | 意味 |
|---|---|
| `surface` | 文章中に出てきた表記 |
| `base_form` | 辞書形 |
| `part_of_speech` | 品詞 |
| `position` | 何番目の単語か |

## 判定用パターン: `src/rule_patterns.py`

`src/rule_patterns.py` は、判定に使うキーワードや正規表現をまとめたファイルです。

たとえば、本文側の強い根拠を表す語は次のように定義されています。

```python
OFFICIAL_SOURCE_WORDS = [
    "公式",
    "発表",
    "公表",
    "本人",
    "企業",
    "警察",
    "自治体",
    "政府",
    "省",
    "庁",
    "裁判所",
    "主催者",
]

CONFIRMED_FACT_WORDS = [
    "決定",
    "確認",
    "判明",
    "成立",
    "開始",
    "終了",
    "実施",
    "発表",
    "公表",
    "明らかにした",
    "認めた",
]
```

見出し側の強い表現は次のようにまとめられています。

```python
HEADLINE_STRONG_WORDS = [
    *DEFINITE_WORDS,
    *CAUSAL_WORDS,
    *BROAD_SCOPE_WORDS,
    *STRONG_SCALE_WORDS,
    *URGENT_IMPORTANT_WORDS,
    "発覚",
    "断定",
    "確実",
    "不可避",
]
```

`*DEFINITE_WORDS` のような書き方は、別のリストの中身をここに展開するという意味です。

たとえば、次の2つは似た意味になります。

```python
numbers = [1, 2]
values = [*numbers, 3, 4]
```

```python
values = [1, 2, 3, 4]
```

## 最終判定: `src/classifier.py`

`src/classifier.py` は、差分一覧から最終判定を決めるファイルです。

実コードは次のとおりです。

```python
from __future__ import annotations

from src.models import Difference, DifferenceStrength, JudgmentLabel


def classify(differences: list[Difference]) -> tuple[JudgmentLabel, str]:
    # docsで固定した判定規則に合わせ、強い差分と中程度の差分を別々に数える。
    strong_count = sum(diff.strength == DifferenceStrength.STRONG for diff in differences)
    medium_count = sum(diff.strength == DifferenceStrength.MEDIUM for diff in differences)

    if strong_count >= 1:
        return (
            JudgmentLabel.LIKELY_EXAGGERATED,
            "強い差分が検出されたため、見出しが本文より強い印象を与えている可能性があります。",
        )
    if medium_count >= 2:
        return (
            JudgmentLabel.LIKELY_EXAGGERATED,
            "中程度の差分が複数検出されたため、見出しが本文より強い印象を与えている可能性があります。",
        )
    if medium_count == 1:
        # 中程度1件だけなら最終判定は整合に留め、画面上の注意点として扱う。
        return (
            JudgmentLabel.CONSISTENT,
            "中程度の差分が1件ありますが、初期判定では整合とし、注意点として表示します。",
        )
    return (
        JudgmentLabel.CONSISTENT,
        "見出しが本文根拠から大きく外れていることを示す差分は検出されませんでした。",
    )
```

### `sum()` の読み方

```python
strong_count = sum(diff.strength == DifferenceStrength.STRONG for diff in differences)
```

これは、強い差分の数を数えています。

Pythonでは、`True` は数値としては `1`、`False` は `0` として扱えます。そのため、条件に合うものだけが1として足されます。

### 最終判定のルール

| 条件 | 判定 |
|---|---|
| 強い差分が1件以上 | 誇張の可能性が高い |
| 中程度の差分が2件以上 | 誇張の可能性が高い |
| 中程度の差分が1件 | 整合。ただし注意点として表示 |
| 差分なし | 整合 |

最終判定だけを図にすると、次のような分岐です。

<div class="diagram">
<pre class="mermaid">
flowchart TD
  D["differences\n差分一覧"] --> SC["強い差分の数を数える"]
  SC --> Q1{"strong_count >= 1 ?"}
  Q1 -->|はい| EX1["誇張の可能性が高い"]
  Q1 -->|いいえ| MC["中程度の差分の数を数える"]
  MC --> Q2{"medium_count >= 2 ?"}
  Q2 -->|はい| EX2["誇張の可能性が高い"]
  Q2 -->|いいえ| Q3{"medium_count == 1 ?"}
  Q3 -->|はい| C1["整合\n注意点として表示"]
  Q3 -->|いいえ| C2["整合\n大きな差分なし"]

  classDef decision fill:#fff7ed,stroke:#c2410c,color:#7c2d12;
  classDef resultBad fill:#fee2e2,stroke:#b91c1c,color:#7f1d1d;
  classDef resultGood fill:#dcfce7,stroke:#15803d,color:#14532d;
  class Q1,Q2,Q3 decision;
  class EX1,EX2 resultBad;
  class C1,C2 resultGood;
</pre>
</div>

| 強い差分数 | 中程度の差分数 | 最終判定 | 画面上の扱い |
|---:|---:|---|---|
| 1以上 | いくつでも | 誇張の可能性が高い | 強い注意として表示 |
| 0 | 2以上 | 誇張の可能性が高い | 複数の注意点として表示 |
| 0 | 1 | 整合 | 注意点として表示 |
| 0 | 0 | 整合 | 大きな差分なし |

## 結果を表形式へ整える: `src/ui_helpers.py`

分析結果は、画面やMarkdownで見やすいように整える必要があります。

`src/ui_helpers.py` は、内部データを表示用の行データに変換します。

```python
def difference_rows(differences: list[Difference]) -> list[dict[str, str]]:
    # st.dataframeなどで扱いやすい行形式へ整形する。
    return [
        {
            "差分の種類": diff.kind,
            "強さ": strength_label(diff.strength),
            "見出しの表現": diff.headline_expression,
            "本文側の表現": diff.summary_expression,
            "理由": diff.reason,
        }
        for diff in differences
    ]
```

この関数は、`Difference` のリストを、表にしやすい辞書のリストへ変換します。

たとえば、イメージとしては次のような形になります。

```python
[
    {
        "差分の種類": "見出し表現が本文根拠より強い",
        "強さ": "強い差分",
        "見出しの表現": "危機",
        "本文側の表現": "懸念がある",
        "理由": "見出し主張は強い見出し表現ですが、本文根拠は弱い根拠に留まります。",
    }
]
```

主張候補ごとの分析結果は、次の関数で表形式にします。

```python
def claim_evidence_rows(analyses: list[ClaimEvidence]) -> list[dict[str, str | float]]:
    # 主張候補ごとの根拠探索結果を、画面表示用の行形式へ変換する。
    return [
        {
            "主張候補": analysis.claim_text,
            "対応本文": analysis.matched_text or "本文中に対応する根拠文なし",
            "対応度": analysis.support_score,
            "本文側の根拠強度": evidence_strength_label(analysis.evidence_strength),
            "見出し側の表現強度": headline_strength_label(analysis.headline_strength),
            "差分の種類": analysis.difference_kind,
            "注意点": analysis.reason,
        }
        for analysis in analyses
    ]
```

## URL記事を保存するCLI: `scripts/save_url_article.py`

このスクリプトは、URLから記事を取得して、実験用Markdownとして保存します。

画面で分析するだけなら必須ではありませんが、実験記事を集めるときに使います。

中心部分は次の流れです。

```python
settings = load_settings()
article = fetch_article_for_saving(args.url, settings)
output_path = resolve_output_path(article.title, args.output)
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_text(
    render_article_markdown(
        title=article.title,
        body=article.body,
        headline_type=args.headline_type,
        expected_label=args.expected_label,
        source_name=article.source_name,
        published_date=article.published_date,
        original_url=args.url,
    ),
    encoding="utf-8",
)
```

通常の記事では、次の関数で取得します。

```python
def fetch_article_for_saving(url: str, settings) -> Article:
    if is_yahoo_news_url(url):
        return fetch_yahoo_news_article(url, settings)

    html = fetch_html(url, settings)
    return parse_article(url, html)
```

Yahoo!ニュースの場合だけ、複数ページの記事に対応するために専用処理へ進みます。

```python
def fetch_yahoo_news_article(url: str, settings, max_pages: int = YAHOO_MAX_PAGES) -> Article:
    articles: list[Article] = []
    seen_bodies: set[str] = set()

    for page_number in range(1, max_pages + 1):
        page_url = build_page_url(url, page_number)
        try:
            html = fetch_html(page_url, settings)
            article = parse_article(page_url, html)
        except AppError:
            if page_number == 1:
                raise
            break

        normalized_body = normalize_body_for_duplicate_check(article.body)
        if normalized_body in seen_bodies:
            break
        seen_bodies.add(normalized_body)
        articles.append(article)

    if not articles:
        raise AppError("Yahoo!ニュースの記事本文を取得できませんでした。")

    first_article = articles[0]
    combined_body = "\n\n".join(article.body for article in articles)
    return Article(
        url=url,
        title=first_article.title,
        body=combined_body,
        published_date=first_article.published_date,
        source_name=first_article.source_name,
    )
```

`for page_number in range(1, max_pages + 1):` は、1ページ目から最大10ページ目まで順番に試すという意味です。

## ローカル記事を分析して結果Markdownを出すCLI: `scripts/analyze_local_article.py`

このスクリプトは、保存済みMarkdownを読み込み、分析し、結果Markdownを保存します。

中心部分は次のとおりです。

```python
article_path = Path(args.article_path).resolve()
article, metadata = load_local_article(article_path, require_experiment_labels=True)
result = analyze_article(article)
output_path = resolve_output_path(article_path, args.output)
output_path.parent.mkdir(parents=True, exist_ok=True)
output_path.write_text(render_result_markdown(article_path, metadata, result), encoding="utf-8")
```

ここでも、最終的な分析は `analyze_article(article)` に任せています。つまり、URLから取得した記事でも、ローカルMarkdownから読み込んだ記事でも、`Article` に変換した後は同じ分析フローに流れます。

結果Markdownを作る部分は次の関数です。

```python
def render_result_markdown(article_path: Path, metadata: dict[str, str], result) -> str:
    expected_label = metadata["expected_label"]
    actual_label = result.judgment.value if result.judgment is not None else "判定なし"
    matched = "一致" if expected_label == actual_label else "不一致"
    differences = render_differences()
    if result.differences:
        differences = render_difference_table(result.differences)
    similarity_section = render_similarity_section(result)

    return f"""# {article_path.stem} 分析結果

## 実験記事情報

- 記事ファイル: `{article_path}`
- 見出し: {result.article.title}
- 見出し種別: {metadata["headline_type"]}
- 期待ラベル: {expected_label}
- システム判定: {actual_label}
- 判定一致: {matched}

## 本文要約

{result.summary.summary_text or result.summary.main_claim or "要約なし"}

## 要約の構造化情報

- 主な主張: {result.summary.main_claim or "不明"}
- 対象範囲: {result.summary.scope or "不明"}
- 断定度: {result.summary.certainty or "不明"}
- 因果関係: {result.summary.causal_relation or "不明"}
- 数量・規模: {result.summary.quantity_scale or "不明"}
- 重要度・緊急性: {result.summary.urgency_importance or "不明"}
- 不確実表現: {", ".join(result.summary.uncertainty_expressions) or "なし"}

## 判定理由

{result.reason or "判定理由なし"}

{similarity_section}

## 検出された差分

{differences}
"""
```

現在の主判定では本文要約は使わないため、`本文要約` や `要約の構造化情報` は空に近い表示になることがあります。主に見るべきなのは、判定理由と差分です。

## 補足: `src/summarizer.py` と `src/rule_checks.py`

`src/summarizer.py` は、Gemini APIで本文要約を作る補助機能です。ただし、現在の主判定フローでは使われていません。

`src/rule_checks.py` は、要約と見出しを比較する旧方式のルール群です。現在の主判定は、`src/evidence_rules.py` にある本文根拠探索方式です。

そのため、この2ファイルを読むときは、「今の主処理ではなく、過去方式または補助機能」として見るのが安全です。

## 初心者向けの読み進め方

初めて読む場合は、次の順番がおすすめです。

1. `src/models.py` で、どんなデータを扱うか見る。
2. `src/analyzer.py` で、全体の呼び出し順を見る。
3. `src/article_fetcher.py` で、URL取得の処理を見る。
4. `src/article_parser.py` で、HTMLから記事情報を作る処理を見る。
5. `src/evidence_rules.py` の `analyze_claim_evidence()` だけ読む。
6. `src/evidence_rules.py` の `analyze_single_claim()` を読む。
7. `src/classifier.py` で、最終判定の条件を見る。
8. 余裕があれば `src/preprocess.py` と `src/rule_patterns.py` を読む。

最初から `evidence_rules.py` 全体を完璧に理解しようとすると大変です。まずは、関数名を見て「何をしているか」を追うだけでも十分です。

## 付録A: 主要バックエンドファイルの実コード

ここからは、主要なバックエンドコードをそのまま掲載します。解説部分と照らし合わせながら読むための付録です。

### `src/analyzer.py`

```python
from __future__ import annotations

from src.article_fetcher import fetch_html
from src.article_parser import parse_article
from src.classifier import classify
from src.config import load_settings
from src.evidence_rules import analyze_claim_evidence
from src.local_article_loader import parse_local_article_markdown
from src.models import AnalysisResult, Article


def analyze_url(url: str) -> AnalysisResult:
    # URL分析の入口として、取得から判定までの各責務を順番に接続する。
    settings = load_settings()
    html = fetch_html(url, settings)
    article = parse_article(url, html)
    return analyze_article(article)


def analyze_local_markdown(markdown_text: str, *, source_id: str) -> AnalysisResult:
    # 画面やCLIから受け取ったローカルMarkdown記事を、既存の判定フローへ流す。
    article, _metadata = parse_local_article_markdown(markdown_text, source_id=source_id)
    return analyze_article(article)


def analyze_article(article: Article) -> AnalysisResult:
    # 実験用のローカル記事など、取得済みの記事情報を既存の判定フローに流す入口。
    claim_analyses, differences = analyze_claim_evidence(article.title, article.body)
    judgment, reason = classify(differences)
    return AnalysisResult(
        article=article,
        judgment=judgment,
        reason=reason,
        differences=differences,
        claim_analyses=claim_analyses,
    )
```

### `src/article_fetcher.py`

```python
from __future__ import annotations

from urllib.parse import urlparse

from bs4 import UnicodeDammit
import requests

from src.config import Settings
from src.models import AppError


def fetch_html(url: str, settings: Settings) -> str:
    # 記事取得前にURL形式を確認し、画面側へ出せる業務エラーに変換する。
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise AppError("有効なニュース記事URLを入力してください。")

    try:
        # User-Agentを明示し、ニュースサイト側で通常のHTTPクライアントとして扱われやすくする。
        response = requests.get(
            url,
            timeout=settings.request_timeout_seconds,
            headers={
                "User-Agent": "headline-exaggeration-detector/0.1 (+https://example.local)"
            },
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise AppError("記事ページを取得できませんでした。URLやサイトの公開状態を確認してください。") from exc

    return _decode_html_response(response)


def _decode_html_response(response: requests.Response) -> str:
    # 日本語ニュースサイトではHTTPヘッダーよりHTML内のcharset宣言が正しい場合がある。
    # response.textに任せる前に、本文バイト列からHTML向けの文字コード判定を行う。
    decoded = UnicodeDammit(response.content, is_html=True).unicode_markup
    if decoded:
        return decoded
    return response.text
```

### `src/article_parser.py`

```python
from __future__ import annotations

import json

from bs4 import BeautifulSoup
import trafilatura

from src.models import AppError, Article


def parse_article(url: str, html: str) -> Article:
    # trafilaturaを主経路にして、本文・タイトル・メタ情報をまとめて抽出する。
    extracted = trafilatura.extract(
        html,
        output_format="json",
        with_metadata=True,
        include_comments=False,
        include_tables=False,
        favor_precision=True,
    )
    data: dict[str, str] = {}
    if extracted:
        try:
            data = json.loads(extracted)
        except json.JSONDecodeError:
            data = {}

    soup = BeautifulSoup(html, "html.parser")
    # 抽出ライブラリで欠けたメタ情報はHTMLタグから補完する。
    title = _clean_text(data.get("title")) or _extract_title(soup)
    body = _clean_text(data.get("text"))
    published_date = _clean_text(data.get("date")) or _meta_content(
        soup, ["article:published_time", "pubdate", "date"]
    )
    source_name = _clean_text(data.get("sitename")) or _meta_content(
        soup, ["og:site_name", "application-name"]
    )

    if not title:
        raise AppError("記事タイトルを抽出できませんでした。")
    if not body or len(body) < 80:
        # 短すぎる本文は、ログイン壁や抽出失敗を本文として扱わないためエラーにする。
        raise AppError("記事本文を抽出できませんでした。ログイン不要の公開記事URLか確認してください。")

    return Article(
        url=url,
        title=title,
        body=body,
        published_date=published_date,
        source_name=source_name,
    )


def _extract_title(soup: BeautifulSoup) -> str:
    # OGP、titleタグ、h1の順に、ニュース記事の見出しらしい値を探す。
    og_title = _meta_content(soup, ["og:title", "twitter:title"])
    if og_title:
        return og_title
    if soup.title and soup.title.string:
        return _clean_text(soup.title.string)
    heading = soup.find("h1")
    return _clean_text(heading.get_text(" ", strip=True)) if heading else ""


def _meta_content(soup: BeautifulSoup, names: list[str]) -> str | None:
    # property属性とname属性の両方を見て、サイトごとのメタタグ表記揺れを吸収する。
    for name in names:
        tag = soup.find("meta", attrs={"property": name}) or soup.find("meta", attrs={"name": name})
        if tag and tag.get("content"):
            return _clean_text(tag["content"])
    return None


def _clean_text(value: str | None) -> str:
    # 改行や連続空白を潰し、比較・表示で扱いやすい1行テキストへ寄せる。
    if not value:
        return ""
    return " ".join(value.split())
```

### `src/classifier.py`

```python
from __future__ import annotations

from src.models import Difference, DifferenceStrength, JudgmentLabel


def classify(differences: list[Difference]) -> tuple[JudgmentLabel, str]:
    # docsで固定した判定規則に合わせ、強い差分と中程度の差分を別々に数える。
    strong_count = sum(diff.strength == DifferenceStrength.STRONG for diff in differences)
    medium_count = sum(diff.strength == DifferenceStrength.MEDIUM for diff in differences)

    if strong_count >= 1:
        return (
            JudgmentLabel.LIKELY_EXAGGERATED,
            "強い差分が検出されたため、見出しが本文より強い印象を与えている可能性があります。",
        )
    if medium_count >= 2:
        return (
            JudgmentLabel.LIKELY_EXAGGERATED,
            "中程度の差分が複数検出されたため、見出しが本文より強い印象を与えている可能性があります。",
        )
    if medium_count == 1:
        # 中程度1件だけなら最終判定は整合に留め、画面上の注意点として扱う。
        return (
            JudgmentLabel.CONSISTENT,
            "中程度の差分が1件ありますが、初期判定では整合とし、注意点として表示します。",
        )
    return (
        JudgmentLabel.CONSISTENT,
        "見出しが本文根拠から大きく外れていることを示す差分は検出されませんでした。",
    )
```

### `src/morphological_analyzer.py`

```python
from __future__ import annotations

from functools import lru_cache

from sudachipy import SplitMode, dictionary

from src.models import TokenFeature


@lru_cache(maxsize=1)
def _tokenizer():
    return dictionary.Dictionary().create()


def tokenize_text(text: str) -> list[TokenFeature]:
    # SudachiPy固有の戻り値を、ルール判定で使う共通モデルへ変換する。
    tokens: list[TokenFeature] = []
    for index, morpheme in enumerate(_tokenizer().tokenize(text or "", SplitMode.C)):
        tokens.append(
            TokenFeature(
                surface=morpheme.surface(),
                base_form=morpheme.dictionary_form(),
                part_of_speech=",".join(morpheme.part_of_speech()),
                position=index,
            )
        )
    return tokens
```

### `src/ui_helpers.py`

```python
from __future__ import annotations

from src.models import (
    ClaimEvidence,
    Difference,
    DifferenceStrength,
    EvidenceStrength,
    HeadlineExpressionStrength,
    JudgmentLabel,
)


def judgment_badge_type(judgment: JudgmentLabel) -> str:
    # Streamlitの表示種別に変換し、判定ラベルと画面装飾の対応をここに閉じ込める。
    if judgment == JudgmentLabel.LIKELY_EXAGGERATED:
        return "error"
    return "success"


def strength_label(strength: DifferenceStrength) -> str:
    # 内部値を、画面にそのまま出せる日本語ラベルへ変換する。
    if strength == DifferenceStrength.STRONG:
        return "強い差分"
    return "中程度の差分"


def evidence_strength_label(strength: EvidenceStrength) -> str:
    labels = {
        EvidenceStrength.STRONG: "強い根拠",
        EvidenceStrength.MEDIUM: "中程度の根拠",
        EvidenceStrength.WEAK: "弱い根拠",
        EvidenceStrength.NONE: "根拠なし",
    }
    return labels[strength]


def headline_strength_label(strength: HeadlineExpressionStrength) -> str:
    labels = {
        HeadlineExpressionStrength.STRONG: "強い表現",
        HeadlineExpressionStrength.MEDIUM: "中程度の表現",
        HeadlineExpressionStrength.WEAK: "弱い表現",
    }
    return labels[strength]


def difference_rows(differences: list[Difference]) -> list[dict[str, str]]:
    # st.dataframeなどで扱いやすい行形式へ整形する。
    return [
        {
            "差分の種類": diff.kind,
            "強さ": strength_label(diff.strength),
            "見出しの表現": diff.headline_expression,
            "本文側の表現": diff.summary_expression,
            "理由": diff.reason,
        }
        for diff in differences
    ]


def claim_evidence_rows(analyses: list[ClaimEvidence]) -> list[dict[str, str | float]]:
    # 主張候補ごとの根拠探索結果を、画面表示用の行形式へ変換する。
    return [
        {
            "主張候補": analysis.claim_text,
            "対応本文": analysis.matched_text or "本文中に対応する根拠文なし",
            "対応度": analysis.support_score,
            "本文側の根拠強度": evidence_strength_label(analysis.evidence_strength),
            "見出し側の表現強度": headline_strength_label(analysis.headline_strength),
            "差分の種類": analysis.difference_kind,
            "注意点": analysis.reason,
        }
        for analysis in analyses
    ]
```

## 付録B: 中核ロジック `src/evidence_rules.py` の実コード

`src/evidence_rules.py` は、現在の主判定フローで最も重要なファイルです。本文中では関数ごとに分けて説明しましたが、ここではファイル全体の実コードを掲載します。

```python
from __future__ import annotations

import re
from collections.abc import Iterable

from src import rule_patterns as patterns
from src.models import (
    ClaimEvidence,
    Difference,
    DifferenceStrength,
    EvidenceStrength,
    HeadlineExpressionStrength,
)
from src.preprocess import normalize_text, preprocess_text


MIN_SUPPORT_SCORE = 0.34
_SENTENCE_PATTERN = re.compile(r"[^。！？!?]+[。！？!?]?")
_QUOTE_PATTERN = re.compile(r"[「『“\"]([^」』”\"]{2,60})[」』”\"]")
_CHUNK_SEPARATOR = re.compile(r"[、。！？!?｜|／/（）()【】\[\]\s]+")
_CAUSAL_OR_CONTRAST_MARKERS = [
    "で",
    "により",
    "受け",
    "原因で",
    "なのに",
    "一方で",
    "も",
]
_STRONG_MODIFIERS = [
    "衝撃の",
    "異例の",
    "深刻な",
    "重大な",
    "緊急の",
]
_STOP_TERMS = {
    "ニュース",
    "記事",
    "写真",
    "画像",
    "速報",
    "Yahoo",
    "ヤフー",
    "配信",
    "全文",
}


def analyze_claim_evidence(headline: str, body: str) -> tuple[list[ClaimEvidence], list[Difference]]:
    body_units = split_body_units(body)
    claims = extract_headline_claims(headline)
    analyses = [analyze_single_claim(claim, body_units) for claim in claims]
    differences = [
        Difference(
            kind=analysis.difference_kind,
            strength=analysis.difference_strength,
            headline_expression=analysis.claim_text,
            summary_expression=analysis.matched_text or "本文中に対応する根拠文なし",
            reason=analysis.reason,
        )
        for analysis in analyses
        if analysis.difference_strength is not None
    ]
    return analyses, differences


def split_body_units(body: str) -> list[str]:
    normalized = normalize_text(body).replace("\r\n", "\n").replace("\r", "\n")
    units: list[str] = []
    for paragraph in re.split(r"\n+", normalized):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        sentences = [match.group(0).strip() for match in _SENTENCE_PATTERN.finditer(paragraph)]
        if len(sentences) <= 1 and len(paragraph) > 120:
            sentences = [paragraph[index : index + 120].strip() for index in range(0, len(paragraph), 120)]
        units.extend(sentence for sentence in sentences if len(sentence) >= 8)
    return _unique_preserve_order(units)


def extract_headline_claims(headline: str) -> list[str]:
    normalized = _strip_source_suffix(normalize_text(headline))
    candidates: list[str] = []

    candidates.extend(match.group(1).strip() for match in _QUOTE_PATTERN.finditer(normalized))

    chunks = [chunk for chunk in _CHUNK_SEPARATOR.split(normalized) if chunk]
    for chunk in chunks:
        if _looks_like_claim_chunk(chunk):
            candidates.append(chunk)

    tail = _tail_claim(normalized)
    if tail:
        candidates.append(tail)

    if not candidates:
        candidates.append(normalized)

    return _unique_preserve_order(_clean_claim(candidate) for candidate in candidates if candidate)


def analyze_single_claim(claim: str, body_units: list[str]) -> ClaimEvidence:
    important_terms = _important_terms(claim)
    best_text = ""
    best_score = 0.0
    best_terms: list[str] = []

    for unit in body_units:
        score, matched_terms = correspondence_score(claim, unit, important_terms)
        if score > best_score:
            best_score = score
            best_text = unit
            best_terms = matched_terms

    has_support = best_score >= MIN_SUPPORT_SCORE
    evidence_strength = (
        classify_evidence_strength(best_text, best_score, best_terms, important_terms)
        if has_support
        else EvidenceStrength.NONE
    )
    headline_strength = classify_headline_strength(claim)
    difference_strength, difference_kind = compare_strengths(headline_strength, evidence_strength)
    reason = build_reason(
        claim=claim,
        matched_text=best_text if has_support else "",
        headline_strength=headline_strength,
        evidence_strength=evidence_strength,
        difference_strength=difference_strength,
        score=best_score,
        matched_terms=best_terms,
    )

    return ClaimEvidence(
        claim_text=claim,
        matched_text=best_text if has_support else "",
        support_score=round(best_score, 3),
        important_terms=important_terms,
        matched_terms=best_terms,
        evidence_strength=evidence_strength,
        headline_strength=headline_strength,
        difference_strength=difference_strength,
        difference_kind=difference_kind,
        reason=reason,
    )


def correspondence_score(
    claim: str,
    body_unit: str,
    important_terms: list[str] | None = None,
) -> tuple[float, list[str]]:
    claim_terms = important_terms or _important_terms(claim)
    body_text = _canonical(body_unit)
    body_features = preprocess_text(body_unit)
    body_terms = {_canonical(term) for term in body_features.important_terms}
    matched_terms: list[str] = []

    for term in claim_terms:
        key = _canonical(term)
        if not key:
            continue
        if key in body_text or key in body_terms:
            matched_terms.append(term)

    if not claim_terms:
        direct_score = 1.0 if _canonical(claim) and _canonical(claim) in body_text else 0.0
        return direct_score, []

    coverage = len(matched_terms) / len(claim_terms)
    number_bonus = _number_bonus(claim, body_unit)
    phrase_bonus = 0.18 if _canonical(claim) and _canonical(claim) in body_text else 0.0
    proximity_bonus = _proximity_bonus(matched_terms, body_unit)
    score = min(1.0, coverage * 0.72 + number_bonus + phrase_bonus + proximity_bonus)
    return score, _unique_preserve_order(matched_terms)


def classify_evidence_strength(
    text: str,
    score: float,
    matched_terms: list[str],
    important_terms: list[str],
) -> EvidenceStrength:
    if not text or score < MIN_SUPPORT_SCORE:
        return EvidenceStrength.NONE
    if _contains_any(text, patterns.WEAK_EVIDENCE_WORDS):
        return EvidenceStrength.WEAK
    if _contains_any(text, patterns.OFFICIAL_SOURCE_WORDS) and _contains_any(text, patterns.CONFIRMED_FACT_WORDS):
        return EvidenceStrength.STRONG
    if _contains_any(text, patterns.CONFIRMED_FACT_WORDS):
        return EvidenceStrength.STRONG
    if patterns.NUMBER_PATTERN.search(text) and len(matched_terms) >= max(1, len(important_terms) // 2):
        return EvidenceStrength.STRONG
    if _contains_any(text, patterns.MEDIUM_EVIDENCE_WORDS):
        return EvidenceStrength.MEDIUM
    if score >= 0.72:
        return EvidenceStrength.MEDIUM
    return EvidenceStrength.WEAK


def classify_headline_strength(claim: str) -> HeadlineExpressionStrength:
    if _contains_any(claim, patterns.HEADLINE_STRONG_WORDS):
        return HeadlineExpressionStrength.STRONG
    if _contains_any(claim, patterns.HEADLINE_WEAK_WORDS):
        return HeadlineExpressionStrength.WEAK
    if _contains_any(claim, patterns.HEADLINE_MEDIUM_WORDS):
        return HeadlineExpressionStrength.MEDIUM
    if claim.endswith(("か", "か?", "か？", "説", "疑惑")):
        return HeadlineExpressionStrength.MEDIUM
    return HeadlineExpressionStrength.WEAK


def compare_strengths(
    headline_strength: HeadlineExpressionStrength,
    evidence_strength: EvidenceStrength,
) -> tuple[DifferenceStrength | None, str]:
    if headline_strength == HeadlineExpressionStrength.STRONG and evidence_strength in {
        EvidenceStrength.NONE,
        EvidenceStrength.WEAK,
    }:
        return DifferenceStrength.STRONG, "見出し表現が本文根拠より強い"
    if headline_strength == HeadlineExpressionStrength.MEDIUM and evidence_strength == EvidenceStrength.NONE:
        return DifferenceStrength.STRONG, "見出し主張の本文根拠なし"
    if headline_strength == HeadlineExpressionStrength.MEDIUM and evidence_strength == EvidenceStrength.WEAK:
        return DifferenceStrength.MEDIUM, "見出し表現に対して本文根拠が弱い"
    return None, "差分なし"


def build_reason(
    claim: str,
    matched_text: str,
    headline_strength: HeadlineExpressionStrength,
    evidence_strength: EvidenceStrength,
    difference_strength: DifferenceStrength | None,
    score: float,
    matched_terms: list[str],
) -> str:
    headline_label = _headline_strength_label(headline_strength)
    evidence_label = _evidence_strength_label(evidence_strength)
    if not matched_text:
        return (
            f"見出し主張「{claim}」は{headline_label}ですが、本文中に十分対応する根拠文が見つかりませんでした。"
        )
    matched = "、".join(matched_terms) or "主要語"
    if difference_strength is None:
        return (
            f"見出し主張「{claim}」は{headline_label}で、本文根拠は{evidence_label}です。"
            f"対応度は{score:.2f}で、対応語は「{matched}」です。"
        )
    return (
        f"見出し主張「{claim}」は{headline_label}ですが、本文根拠は{evidence_label}に留まります。"
        f"対応度は{score:.2f}で、対応語は「{matched}」です。"
    )


def _looks_like_claim_chunk(chunk: str) -> bool:
    if len(chunk) < 2:
        return False
    if patterns.NUMBER_PATTERN.search(chunk):
        return True
    if any(marker in chunk for marker in _CAUSAL_OR_CONTRAST_MARKERS):
        return True
    if any(modifier in chunk for modifier in _STRONG_MODIFIERS):
        return True
    if _contains_any(chunk, patterns.HEADLINE_STRONG_WORDS + patterns.HEADLINE_MEDIUM_WORDS):
        return True
    return any(re.search(pattern, chunk) for pattern in patterns.CLAIM_TAIL_PATTERNS)


def _tail_claim(text: str) -> str:
    tail_source = text[-48:]
    for pattern in patterns.CLAIM_TAIL_PATTERNS:
        match = re.search(pattern, tail_source)
        if match:
            return match.group(0)
    chunks = [chunk for chunk in _CHUNK_SEPARATOR.split(text) if chunk]
    return chunks[-1] if chunks else text


def _important_terms(text: str) -> list[str]:
    features = preprocess_text(text)
    terms = [
        term
        for term in [*features.important_terms, *patterns.NUMBER_PATTERN.findall(text)]
        if len(_canonical(term)) >= 2 and term not in _STOP_TERMS
    ]
    return _unique_preserve_order(terms)


def _strip_source_suffix(text: str) -> str:
    return re.split(r"\s+-\s+|\s+｜\s+|\s+\|\s+", text, maxsplit=1)[0].strip()


def _clean_claim(claim: str) -> str:
    return claim.strip(" 　、。！？!?「」『』【】()（）")


def _number_bonus(claim: str, body_unit: str) -> float:
    claim_numbers = {_canonical(number) for number in patterns.NUMBER_PATTERN.findall(claim)}
    if not claim_numbers:
        return 0.0
    body_numbers = {_canonical(number) for number in patterns.NUMBER_PATTERN.findall(body_unit)}
    return 0.16 if claim_numbers & body_numbers else 0.0


def _proximity_bonus(matched_terms: list[str], body_unit: str) -> float:
    if len(matched_terms) < 2:
        return 0.0
    canonical_body = _canonical(body_unit)
    positions = [canonical_body.find(_canonical(term)) for term in matched_terms]
    positions = [position for position in positions if position >= 0]
    if len(positions) < 2:
        return 0.0
    return 0.1 if max(positions) - min(positions) <= 40 else 0.04


def _contains_any(text: str, words: Iterable[str]) -> bool:
    return any(word and word in text for word in words)


def _headline_strength_label(strength: HeadlineExpressionStrength) -> str:
    labels = {
        HeadlineExpressionStrength.STRONG: "強い見出し表現",
        HeadlineExpressionStrength.MEDIUM: "中程度の見出し表現",
        HeadlineExpressionStrength.WEAK: "弱い見出し表現",
    }
    return labels[strength]


def _evidence_strength_label(strength: EvidenceStrength) -> str:
    labels = {
        EvidenceStrength.STRONG: "強い根拠",
        EvidenceStrength.MEDIUM: "中程度の根拠",
        EvidenceStrength.WEAK: "弱い根拠",
        EvidenceStrength.NONE: "根拠なし",
    }
    return labels[strength]


def _canonical(text: str) -> str:
    return re.sub(r"\W+", "", normalize_text(text)).lower()


def _unique_preserve_order(values: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        key = _canonical(value)
        if not key or key in seen:
            continue
        seen.add(key)
        result.append(value)
    return result
```

## 付録C: さらに深く読む場合の順番

このドキュメントでは、本文中にバックエンドの主要コードをコードブロックで掲載し、付録Bに中核ロジックの全体を掲載しました。さらに全ファイルを読む場合は、次の順番でファイルを開くと理解しやすいです。

1. `src/evidence_rules.py`
2. `src/preprocess.py`
3. `src/rule_patterns.py`
4. `src/models.py`
5. `src/local_article_loader.py`
6. `scripts/save_url_article.py`
7. `scripts/analyze_local_article.py`

特に `src/evidence_rules.py` は長いので、最初は次の関数だけを追うのがおすすめです。

1. `analyze_claim_evidence()`
2. `split_body_units()`
3. `extract_headline_claims()`
4. `analyze_single_claim()`
5. `correspondence_score()`
6. `classify_evidence_strength()`
7. `classify_headline_strength()`
8. `compare_strengths()`
