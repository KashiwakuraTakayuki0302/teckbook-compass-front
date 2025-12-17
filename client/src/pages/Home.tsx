import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/BookCard";
// TODO: API改修後に復活させる
// import { TrendCard } from "@/components/TrendCard";
import { Layout } from "@/components/Layout";
// TODO: API改修後に復活させる
// import { useCategoriesWithBooks } from "@/hooks/useCategories";
import { useRankings } from "@/hooks/useRankings";

export default function Home() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const rankingPeriod = (params.get("tab") as 'all' | 'monthly' | 'yearly') || 'all';

  const setRankingPeriod = (period: 'all' | 'monthly' | 'yearly') => {
    const newParams = new URLSearchParams(search);
    newParams.set("tab", period);
    setLocation(`${location}?${newParams.toString()}`);
  };

  useEffect(() => {
    document.title = "エンジニアが本当におすすめする技術書ランキング|Qiita発・毎月更新【技術書コンパス】";
  }, []);
  // TODO: API改修後に復活させる
  // const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategoriesWithBooks();
  const { data: rankings, isLoading: isRankingsLoading, isError: isRankingsError } = useRankings(rankingPeriod);

  return (
    <Layout>
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

            {/* 検索バー（後で追加予定）*/}
          </div>
        </div>
      </section>

      {/* TODO: API改修後に復活させる - トレンド分野セクション */}
      {/*
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
          {isCategoriesError ? (
            <div className="text-center text-red-500">情報を取得に失敗しました</div>
          ) : isCategoriesLoading ? (
            <div className="text-center">読み込み中...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.items?.map((category: any, index: number) => (
                <TrendCard
                  key={category.id || index}
                  category={category.name}
                  icon={category.icon || "📚"}
                  trendIndicator={category.trendIndicator || "注目"}
                  topBooks={category.books?.map((book: any) => ({
                    id: book.bookId,
                    title: book.title,
                    coverImage: book.image,
                  })) || []}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      */}

      {/* 技術書ランキングセクション */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              📚 総合ランキング
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Qiita記事で最も言及されている技術書
            </p>
            <div className="flex justify-center gap-2">
              <Button
                variant={rankingPeriod === 'all' ? 'default' : 'outline'}
                size="sm"
                className="disabled:opacity-100"
                onClick={() => setRankingPeriod('all')}
                disabled={rankingPeriod === 'all'}
              >
                すべて
              </Button>
              <Button
                variant={rankingPeriod === 'monthly' ? 'default' : 'outline'}
                size="sm"
                className="disabled:opacity-100"
                onClick={() => setRankingPeriod('monthly')}
                disabled={rankingPeriod === 'monthly'}
              >
                月間
              </Button>
              <Button
                variant={rankingPeriod === 'yearly' ? 'default' : 'outline'}
                size="sm"
                className="disabled:opacity-100"
                onClick={() => setRankingPeriod('yearly')}
                disabled={rankingPeriod === 'yearly'}
              >
                年間
              </Button>
            </div>
          </div>
          {isRankingsError ? (
            <div className="text-center text-red-500">情報の取得に失敗しました</div>
          ) : isRankingsLoading ? (
            <div className="text-center">読み込み中...</div>
          ) : (
            <div className="space-y-4">
              {rankings?.items?.map((book: any) => (
                <BookCard
                  key={book.bookId}
                  id={book.bookId}
                  rank={book.rank}
                  title={book.title}
                  author={book.author}
                  publishDate={book.publishedAt || "不明"}
                  coverImage={book.thumbnail}
                  rating={book.rating || 0}
                  reviewCount={book.reviewCount || 0}
                  qiitaMentions={book.articleCount || 0}
                  tags={book.tags || []}
                  amazonUrl={book.amazonUrl}
                  rakutenUrl={book.rakutenUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>

    </Layout>
  );
}
