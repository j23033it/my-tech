---
title: "Pythonオブジェクト指向の基礎"
description: "class、インスタンス、self、継承、ポリモーフィズム、dataclassまでを、Python初学者向けに整理するオブジェクト指向入門ガイド。"
category: "プログラミング言語"
categorySlug: "languages"
tags: ["Python", "オブジェクト指向", "class", "継承", "dataclass"]
level: "beginner"
updated: "2026-05-21"
draft: false
---

<p class="lead">Pythonのオブジェクト指向は、関連するデータと処理を「オブジェクト」というまとまりで扱うための考え方です。この記事では、クラス、インスタンス、<code>self</code>、メソッド、継承、ポリモーフィズムを、実際のコード例と一緒に整理します。</p>

<section id="overview" data-search-section>
  <h2>1. オブジェクト指向とは何か</h2>
  <p class="lead">オブジェクト指向は、プログラムを「データ」と「そのデータを扱う処理」のまとまりとして設計する考え方です。</p>

  <p>たとえば、ユーザー情報を扱うコードでは、名前、メールアドレス、ログイン回数などのデータと、「ログイン回数を増やす」「表示名を作る」といった処理がセットで出てきます。これらを別々の変数と関数として散らばらせるのではなく、<code>User</code> というまとまりに閉じ込めると、コードの責任範囲が見えやすくなります。</p>

  <div class="diagram">
    <pre class="mermaid">
flowchart LR
  C["class User"] --> D["データ: name, email, login_count"]
  C --> M["処理: login(), display_name()"]
  C --> O1["user1 インスタンス"]
  C --> O2["user2 インスタンス"]
    </pre>
  </div>

  <div class="note">
    <strong>最初の理解:</strong> クラスは「設計図」、インスタンスは「設計図から作った実物」です。クラスそのものよりも、「同じ種類のデータと処理をまとめたい場面で使う」と考えると入りやすいです。
  </div>
</section>

<section id="why-oop" data-search-section>
  <h2>2. 何のために使うのか</h2>
  <p class="lead">オブジェクト指向は、コード量を短くするためだけのものではありません。変更しやすい単位を作るための考え方です。</p>

  <div class="grid">
    <article class="card">
      <h3>関係するものをまとめる</h3>
      <p>ユーザーのデータとユーザー操作、商品データと価格計算など、同じ責任を持つものを1か所に集められます。</p>
    </article>
    <article class="card">
      <h3>状態を持たせる</h3>
      <p>関数だけでは扱いづらい「現在の値」「回数」「設定」などを、インスタンスごとに保持できます。</p>
    </article>
    <article class="card">
      <h3>共通処理を再利用する</h3>
      <p>似た種類のオブジェクトに共通する処理を親クラスへまとめ、必要な部分だけ子クラスで変えられます。</p>
    </article>
  </div>
</section>

<section id="mental-model" data-search-section>
  <h2>3. クラスとインスタンスの関係</h2>
  <p class="lead">クラスは型を定義し、インスタンスはその型から作られた具体的な値です。</p>

  <table>
    <thead>
      <tr><th>用語</th><th>意味</th><th>例</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>クラス</td>
        <td>データと処理の設計図</td>
        <td><code>class User:</code></td>
      </tr>
      <tr>
        <td>インスタンス</td>
        <td>クラスから作られた実物</td>
        <td><code>user = User("Alice")</code></td>
      </tr>
      <tr>
        <td>属性</td>
        <td>インスタンスが持つデータ</td>
        <td><code>user.name</code></td>
      </tr>
      <tr>
        <td>メソッド</td>
        <td>クラス内に定義された関数</td>
        <td><code>user.login()</code></td>
      </tr>
      <tr>
        <td><code>self</code></td>
        <td>呼び出し中のインスタンス自身</td>
        <td><code>self.name</code></td>
      </tr>
    </tbody>
  </table>

  <pre><code class="language-python">class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.login_count = 0

    def login(self):
        self.login_count += 1

    def display_name(self):
        return f"{self.name} &lt;{self.email}&gt;"


alice = User("Alice", "alice@example.com")
bob = User("Bob", "bob@example.com")

alice.login()
alice.login()
bob.login()

print(alice.display_name())  # Alice &lt;alice@example.com&gt;
print(alice.login_count)     # 2
print(bob.login_count)       # 1</code></pre>

  <p><code>alice</code> と <code>bob</code> は同じ <code>User</code> クラスから作られていますが、<code>name</code> や <code>login_count</code> は別々に持っています。これがインスタンスを使う大きな理由です。</p>
</section>

<section id="self-init" data-search-section>
  <h2>4. selfと__init__</h2>
  <p class="lead"><code>__init__</code> はインスタンス作成時の初期設定を行うメソッドで、<code>self</code> は作成されたインスタンス自身を指します。</p>

  <p>Pythonでは、メソッドの第1引数として <code>self</code> を明示的に書きます。呼び出す側では <code>user.login()</code> のように書きますが、メソッド内部では「どのユーザーのログイン回数を増やすのか」を <code>self</code> で表します。</p>

  <pre><code class="language-python">class Counter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1


counter = Counter()
counter.increment()
counter.increment()

print(counter.value)  # 2</code></pre>

  <div class="note">
    <strong>つまずきやすい点:</strong> <code>self</code> は特別な予約語ではありませんが、Pythonでは慣習として必ず <code>self</code> と書きます。別名にもできますが、読み手を混乱させるので避けます。
  </div>
</section>

<section id="attributes" data-search-section>
  <h2>5. インスタンス属性とクラス属性</h2>
  <p class="lead">インスタンスごとに違う値はインスタンス属性、クラス全体で共有したい値はクラス属性として扱います。</p>

  <pre><code class="language-python">class Product:
    tax_rate = 0.10  # すべての商品で共有するクラス属性

    def __init__(self, name, price):
        self.name = name      # 商品ごとに違うインスタンス属性
        self.price = price

    def price_with_tax(self):
        return int(self.price * (1 + Product.tax_rate))


book = Product("Python入門", 2000)
pen = Product("ペン", 150)

print(book.price_with_tax())  # 2200
print(pen.price_with_tax())   # 165</code></pre>

  <table>
    <thead>
      <tr><th>種類</th><th>置き場所</th><th>使う場面</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>インスタンス属性</td>
        <td><code>self.name</code> のように代入</td>
        <td>ユーザー名、価格、状態など、個体ごとに違う値</td>
      </tr>
      <tr>
        <td>クラス属性</td>
        <td>クラス直下に定義</td>
        <td>税率、上限値、種類名など、全体で共有する値</td>
      </tr>
    </tbody>
  </table>
</section>

<section id="encapsulation" data-search-section>
  <h2>6. カプセル化</h2>
  <p class="lead">カプセル化は、データの変更ルールをメソッドの中にまとめ、外側から雑に状態を書き換えにくくする考え方です。</p>

  <p>Pythonには、他の言語の <code>private</code> のような強いアクセス制限はありません。その代わり、<code>_balance</code> のように先頭へアンダースコアを付け、「外から直接触る前提ではない」という意図を示すことがよくあります。</p>

  <pre><code class="language-python">class BankAccount:
    def __init__(self, owner, initial_balance=0):
        self.owner = owner
        self._balance = initial_balance

    def deposit(self, amount):
        if amount &lt;= 0:
            raise ValueError("入金額は1以上にしてください")
        self._balance += amount

    def withdraw(self, amount):
        if amount &lt;= 0:
            raise ValueError("出金額は1以上にしてください")
        if amount &gt; self._balance:
            raise ValueError("残高が不足しています")
        self._balance -= amount

    def get_balance(self):
        return self._balance


account = BankAccount("田中", 1000)
account.deposit(500)
account.withdraw(300)

print(account.get_balance())  # 1200</code></pre>

  <p>外側から <code>account._balance = -9999</code> のように書くこと自体はできます。しかし、入金と出金のルールをメソッドに集めておくと、コードを読む人に「この操作を通して変更してほしい」という意図を伝えられます。</p>
</section>

<section id="inheritance" data-search-section>
  <h2>7. 継承</h2>
  <p class="lead">継承は、既存のクラスを土台にして、新しいクラスを作る仕組みです。</p>

  <p>共通する処理を親クラスに置き、違う部分だけ子クラスで追加・上書きできます。Pythonでは、子クラスのメソッドから親クラスのメソッドを呼ぶときに <code>super()</code> を使います。</p>

  <pre><code class="language-python">class Notification:
    def __init__(self, message):
        self.message = message

    def format_message(self):
        return f"[通知] {self.message}"

    def send(self):
        raise NotImplementedError("送信方法は子クラスで定義してください")


class EmailNotification(Notification):
    def __init__(self, message, email):
        super().__init__(message)
        self.email = email

    def send(self):
        print(f"{self.email} にメール送信: {self.format_message()}")


class SlackNotification(Notification):
    def __init__(self, message, channel):
        super().__init__(message)
        self.channel = channel

    def send(self):
        print(f"{self.channel} に投稿: {self.format_message()}")


email = EmailNotification("デプロイが完了しました", "admin@example.com")
slack = SlackNotification("テストが成功しました", "#dev")

email.send()
slack.send()</code></pre>

  <div class="note">
    <strong>使いすぎ注意:</strong> 継承は便利ですが、階層が深くなると処理の流れを追いにくくなります。単に機能を部品として持たせたいだけなら、別クラスを属性として持つ「合成」も検討します。
  </div>
</section>

<section id="polymorphism" data-search-section>
  <h2>8. ポリモーフィズム</h2>
  <p class="lead">ポリモーフィズムは、違う種類のオブジェクトを同じ操作で扱える性質です。</p>

  <p>たとえば、メール通知とSlack通知は中身の送信方法が違います。それでも両方に <code>send()</code> メソッドがあれば、呼び出す側は具体的な種類を気にせず <code>notification.send()</code> と書けます。</p>

  <pre><code class="language-python">notifications = [
    EmailNotification("請求書を送信しました", "billing@example.com"),
    SlackNotification("本番反映が完了しました", "#release"),
]

for notification in notifications:
    notification.send()</code></pre>

  <p>Pythonでは「同じ親クラスを継承しているか」よりも、「必要なメソッドを持っているか」が重視される場面が多いです。この考え方は、アヒルのように歩き、アヒルのように鳴くならアヒルとして扱う、という意味でダックタイピングと呼ばれます。</p>
</section>

<section id="dataclass" data-search-section>
  <h2>9. dataclassでデータ中心のクラスを書く</h2>
  <p class="lead">データを持つことが主目的のクラスは、<code>dataclass</code> を使うと短く読みやすく書けます。</p>

  <p>通常のクラスでは <code>__init__</code> を自分で書きますが、<code>@dataclass</code> を使うと、属性定義から初期化メソッドなどを自動生成してくれます。</p>

  <pre><code class="language-python">from dataclasses import dataclass


@dataclass
class Task:
    title: str
    done: bool = False

    def complete(self):
        self.done = True


task = Task("Pythonの記事を読む")
print(task)  # Task(title='Pythonの記事を読む', done=False)

task.complete()
print(task.done)  # True</code></pre>

  <table>
    <thead>
      <tr><th>書き方</th><th>向いている場面</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>通常のクラス</td>
        <td>初期化処理や振る舞いを細かく制御したい</td>
      </tr>
      <tr>
        <td><code>dataclass</code></td>
        <td>属性を持つデータ構造を簡潔に定義したい</td>
      </tr>
    </tbody>
  </table>
</section>

<section id="workflow" data-search-section>
  <h2>10. 最初の作り方</h2>
  <p class="lead">いきなりクラスから書くのではなく、まず「何をまとめたいのか」を決めると失敗しにくいです。</p>

  <ol>
    <li>同じデータのまとまりが複数出てくるか確認する</li>
    <li>そのデータに対して行う処理を書き出す</li>
    <li>データを属性、処理をメソッドとしてクラスに入れる</li>
    <li>外から直接変更してほしくない値は、メソッド経由で変更する</li>
    <li>似たクラスが増えてから、継承や共通化を考える</li>
  </ol>

  <pre><code class="language-python">class TodoItem:
    def __init__(self, title):
        self.title = title
        self.done = False

    def complete(self):
        self.done = True

    def label(self):
        status = "完了" if self.done else "未完了"
        return f"[{status}] {self.title}"


todo = TodoItem("オブジェクト指向を復習する")
print(todo.label())  # [未完了] オブジェクト指向を復習する

todo.complete()
print(todo.label())  # [完了] オブジェクト指向を復習する</code></pre>
</section>

<section id="comparison" data-search-section>
  <h2>11. 関数だけで書く場合との違い</h2>
  <p class="lead">関数だけで十分な場面もあります。オブジェクト指向は、状態と処理を一緒に管理したいときに効果が出ます。</p>

  <table>
    <thead>
      <tr><th>状況</th><th>関数中心が向く</th><th>クラスが向く</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>単発の変換処理</td>
        <td>文字列整形、数値計算、ファイル名変換</td>
        <td>あまり必要ない</td>
      </tr>
      <tr>
        <td>状態を持つ処理</td>
        <td>引数と戻り値が増えやすい</td>
        <td>カウンター、ユーザー、タスク、ゲームキャラクター</td>
      </tr>
      <tr>
        <td>種類ごとに処理が変わる</td>
        <td><code>if</code> 文が増えやすい</td>
        <td>通知、決済方法、図形、ファイル出力形式</td>
      </tr>
      <tr>
        <td>テストしやすさ</td>
        <td>純粋な関数はテストしやすい</td>
        <td>状態の変化をまとめて確認しやすい</td>
      </tr>
    </tbody>
  </table>

  <div class="note">
    <strong>判断基準:</strong> 「この処理は、何かの状態を覚え続ける必要があるか？」と考えると判断しやすいです。状態がないなら関数で十分なことも多いです。
  </div>
</section>

<section id="pitfalls" data-search-section>
  <h2>12. 初心者がつまずきやすい点</h2>
  <p class="lead">Pythonのオブジェクト指向では、文法そのものよりも「何をクラスにするか」で迷いやすいです。</p>

  <div class="grid">
    <article class="card">
      <h3>何でもクラスにしない</h3>
      <p>短い変換処理や一度だけ使う処理は、関数のままのほうが読みやすいことがあります。</p>
    </article>
    <article class="card">
      <h3><code>self</code> を忘れない</h3>
      <p>インスタンス属性やメソッドを使うには、メソッド定義の第1引数に <code>self</code> が必要です。</p>
    </article>
    <article class="card">
      <h3>継承を深くしすぎない</h3>
      <p>親子関係が何段にもなると、どのメソッドが実行されるのか追いにくくなります。</p>
    </article>
    <article class="card">
      <h3>可変のクラス属性に注意する</h3>
      <p>リストや辞書をクラス属性にすると、複数インスタンスで共有されて思わぬ変更につながることがあります。</p>
    </article>
  </div>

  <pre><code class="language-python">class BadTodoList:
    items = []  # 全インスタンスで共有されてしまう

    def add(self, item):
        self.items.append(item)


class GoodTodoList:
    def __init__(self):
        self.items = []  # インスタンスごとに別のリストを持つ

    def add(self, item):
        self.items.append(item)</code></pre>
</section>

<section id="summary" data-search-section>
  <h2>13. まとめ</h2>
  <p class="lead">Pythonのオブジェクト指向は、データと処理を意味のある単位にまとめ、状態を持つコードを読みやすくするための道具です。</p>

  <table>
    <thead>
      <tr><th>まず覚えること</th><th>意味</th></tr>
    </thead>
    <tbody>
      <tr><td>クラス</td><td>データと処理の設計図</td></tr>
      <tr><td>インスタンス</td><td>クラスから作った具体的なオブジェクト</td></tr>
      <tr><td><code>__init__</code></td><td>インスタンス作成時の初期化処理</td></tr>
      <tr><td><code>self</code></td><td>今操作しているインスタンス自身</td></tr>
      <tr><td>継承</td><td>既存クラスを土台に新しいクラスを作る仕組み</td></tr>
      <tr><td>ポリモーフィズム</td><td>違う種類のオブジェクトを同じ操作で扱う性質</td></tr>
      <tr><td><code>dataclass</code></td><td>データ中心のクラスを短く書く仕組み</td></tr>
    </tbody>
  </table>

  <div class="note">
    <strong>このページのゴール:</strong> オブジェクト指向を「難しい設計手法」として暗記するのではなく、「同じ責任を持つデータと処理をまとめる方法」として使えるようになることです。
  </div>
</section>

<section id="sources" data-search-section>
  <h2>参考ソース</h2>
  <ul>
    <li><a href="https://docs.python.org/3/tutorial/classes.html">Python公式ドキュメント: Classes</a></li>
    <li><a href="https://docs.python.org/3/reference/datamodel.html">Python公式ドキュメント: Data model</a></li>
    <li><a href="https://docs.python.org/3/library/dataclasses.html">Python公式ドキュメント: dataclasses</a></li>
    <li><a href="https://docs.python.org/3/library/functions.html#super">Python公式ドキュメント: super()</a></li>
  </ul>
</section>
