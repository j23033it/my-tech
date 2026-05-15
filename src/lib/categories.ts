export type Category = {
  slug: string;
  name: string;
  description: string;
  accent: "teal" | "blue" | "red";
};

export const categories: Category[] = [
  {
    slug: "web",
    name: "Web基礎",
    description: "ブラウザ、HTTP、HTML/CSS/JavaScriptの土台を整理する。",
    accent: "teal"
  },
  {
    slug: "frontend",
    name: "フロントエンド",
    description: "UI、状態管理、アクセシビリティ、ビルド周りを整理する。",
    accent: "blue"
  },
  {
    slug: "backend",
    name: "バックエンド",
    description: "API、認証、サーバーサイド設計を整理する。",
    accent: "red"
  },
  {
    slug: "languages",
    name: "プログラミング言語",
    description: "Python、Javaなど、言語と実行環境の理解を広げる。",
    accent: "teal"
  },
  {
    slug: "ai",
    name: "AI",
    description: "生成AI、モデル、AIアプリ開発の基本を整理する。",
    accent: "blue"
  },
  {
    slug: "tools",
    name: "開発ツール",
    description: "Git、パッケージ管理、エディタ、CLIを整理する。",
    accent: "red"
  }
];

export const getCategory = (slug: string) => {
  return categories.find((category) => category.slug === slug);
};
