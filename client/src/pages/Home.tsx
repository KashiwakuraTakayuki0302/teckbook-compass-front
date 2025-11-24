import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Book } from "lucide-react";
import { APP_TITLE } from "@/const";
import { BookCard } from "@/components/BookCard";
import { TrendCard } from "@/components/TrendCard";
import { trpc } from "@/lib/trpc";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch trending categories with books
  const { data: trendingCategories = [], isLoading: categoriesLoading } = trpc.categories.trending.useQuery({ limit: 3 });

  // Fetch all books for ranking
  const { data: allBooks = [], isLoading: booksLoading } = trpc.books.list.useQuery({ limit: 5, offset: 0 });

  // サンプルデータ: トレンド分野
  const trendCategories = [
    {
      category: "AI・機械学習",
      icon: "🤖",
      trendIndicator: "急上昇中",
      topBooks: [
        {
          title: "ゼロから作るDeep Learning",
          coverImage: "/book1.jpg",
        },
        {
          title: "機械学習エンジニアになりたい人のための本",
          coverImage: "/book2.jpg",
        },
        {
          title: "Python機械学習プログラミング",
          coverImage: "/book3.jpg",
        },
      ],
    },
    {
      category: "Web開発",
      icon: "🌐",
      trendIndicator: "人気上昇",
      topBooks: [
        {
          title: "リーダブルコード",
          coverImage: "/book1.jpg",
        },
        {
          title: "良いコード/悪いコードで学ぶ設計入門",
          coverImage: "/book2.jpg",
        },
        {
          title: "Web API: The Good Parts",
          coverImage: "/book3.jpg",
        },
      ],
    },
    {
      category: "クラウド・インフラ",
      icon: "☁️",
      trendIndicator: "注目",
      topBooks: [
        {
          title: "AWSではじめるインフラ構築入門",
          coverImage: "/book1.jpg",
        },
        {
          title: "Kubernetesで実践するクラウドネイティブDevOps",
          coverImage: "/book2.jpg",
        },
        {
          title: "インフラエンジニアの教科書",
          coverImage: "/book3.jpg",
        },
      ],
    },
  ];

  // サンプルデータ: 技術書ランキング
  const bookRankings = [
    {
      rank: 1,
      title: "良いコード/悪いコードで学ぶ設計入門 ―保守しやすい 成長し続けるコードの書き方",
      author: "仙塲 大也",
      publishDate: "2022-04-30",
      coverImage: "/book1.jpg",
      rating: 4.5,
      reviewCount: 234,
      qiitaMentions: 859,
      tags: ["設計", "初心者", "技術書", "ミノ駆動本"],
      amazonUrl: "https://www.amazon.co.jp",
      rakutenUrl: "https://books.rakuten.co.jp",
    },
    {
      rank: 2,
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      publishDate: "2008-08-01",
      coverImage: "/book2.jpg",
      rating: 4.7,
      reviewCount: 1523,
      qiitaMentions: 1245,
      tags: ["クリーンコード", "設計", "アジャイル"],
      amazonUrl: "https://www.amazon.co.jp",
      rakutenUrl: "https://books.rakuten.co.jp",
    },
    {
      rank: 3,
      title: "Design Patterns: Elements of Reusable Object-Oriented Software",
      author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
      publishDate: "1994-10-31",
      coverImage: "/book3.jpg",
      rating: 4.6,
      reviewCount: 892,
      qiitaMentions: 678,
      tags: ["デザインパターン", "オブジェクト指向", "設計"],
      amazonUrl: "https://www.amazon.co.jp",
      rakutenUrl: "https://books.rakuten.co.jp",
    },
    {
      rank: 4,
      title: "リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック",
      author: "Dustin Boswell, Trevor Foucher",
      publishDate: "2012-06-23",
      coverImage: "/book1.jpg",
      rating: 4.4,
      reviewCount: 567,
      qiitaMentions: 1523,
      tags: ["初心者", "リーダブルコード", "新人プログラマ応援"],
      amazonUrl: "https://www.amazon.co.jp",
      rakutenUrl: "https://books.rakuten.co.jp",
    },
    {
      rank: 5,
      title: "達人に学ぶDB設計 徹底指南書",
      author: "ミック",
      publishDate: "2012-03-16",
      coverImage: "/book2.jpg",
      rating: 4.3,
      reviewCount: 423,
      qiitaMentions: 789,
      tags: ["データベース", "DB設計", "SQL"],
      amazonUrl: "https://www.amazon.co.jp",
      rakutenUrl: "https://books.rakuten.co.jp",
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // TODO: 検索結果ページへの遷移を実装
      console.log("検索:", searchQuery);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ヘッダー */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Book className="w-8 h-8" />
              <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#" className="hover:underline">
                ホーム
              </a>
              <a href="#" className="hover:underline">
                ランキング
              </a>
              <a href="#" className="hover:underline">
                タグ一覧
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              あなたの学びを加速する
              <br />
              最適な技術書を見つけよう
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Qiita記事から集計した信頼性の高いランキングと
              <br className="hidden md:block" />
              エンジニアのリアルな評価で、最適な一冊に出会えます
            </p>

            {/* 検索バー */}
            <div className="flex gap-2 max-w-2xl mx-auto mt-8">
              <Input
                type="text"
                placeholder="興味のある技術分野を入力（例: React, 機械学習, AWS）"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-white text-foreground border-0 h-12 text-base"
              />
              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8"
              >
                <Search className="w-5 h-5 mr-2" />
                検索
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* トレンド分野セクション */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              🔥 今、注目の技術分野
            </h2>
            <p className="text-muted-foreground">
              最新のトレンドをキャッチして、先取りしよう
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesLoading ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">読み込み中...</p>
              </div>
            ) : trendingCategories.length > 0 ? (
              trendingCategories.map((category) => (
                <TrendCard
                  key={category.id}
                  category={category.name}
                  icon={category.icon || "📚"}
                  trendIndicator={category.trendScore > 90 ? "急上昇中" : category.trendScore > 80 ? "人気上昇" : "注目"}
                  topBooks={category.topBooks.map(book => ({
                    title: book.title,
                    coverImage: book.coverImageUrl || "/book1.jpg",
                  }))}
                />
              ))
            ) : (
              trendCategories.map((trend, index) => (
                <TrendCard key={index} {...trend} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 技術書ランキングセクション */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                📚 総合ランキング
              </h2>
              <p className="text-sm text-muted-foreground">
                Qiita記事で最も言及されている技術書
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm">
                すべて
              </Button>
              <Button variant="outline" size="sm">
                月間
              </Button>
              <Button variant="outline" size="sm">
                年間
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {booksLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">読み込み中...</p>
              </div>
            ) : allBooks.length > 0 ? (
              allBooks.map((book, index) => (
                <BookCard
                  key={book.id}
                  rank={index + 1}
                  title={book.title}
                  author={book.author || "著者不明"}
                  publishDate={book.publishDate || ""}
                  coverImage={book.coverImageUrl || "/book1.jpg"}
                  rating={book.averageRating || 0}
                  reviewCount={book.reviewCount}
                  qiitaMentions={book.qiitaMentions}
                  tags={[]} // TODO: タグを取得
                  amazonUrl={book.amazonUrl || "https://www.amazon.co.jp"}
                  rakutenUrl={book.rakutenUrl || "https://books.rakuten.co.jp"}
                />
              ))
            ) : (
              bookRankings.map((book) => (
                <BookCard key={book.rank} {...book} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-muted py-8 mt-auto">
        <div className="container text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 {APP_TITLE}. Qiita記事から技術書ランキングを集計しています。
          </p>
        </div>
      </footer>
    </div>
  );
}
