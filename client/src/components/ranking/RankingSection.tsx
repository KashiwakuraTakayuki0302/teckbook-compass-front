import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/book/BookCard";
import { useRankings } from "@/hooks/useRankings";
import { useLocation, useSearch } from "wouter";
import type { RankedBookDetail } from "@/api/models/RankedBookDetail";

export function RankingSection() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const rankingPeriod = (params.get("tab") as 'all' | 'monthly' | 'yearly') || 'all';

  const setRankingPeriod = (period: 'all' | 'monthly' | 'yearly') => {
    const newParams = new URLSearchParams(search);
    newParams.set("tab", period);
    setLocation(`${location}?${newParams.toString()}`);
  };

  const { data: rankings, isLoading: isRankingsLoading, isError: isRankingsError } = useRankings(rankingPeriod);

  return (
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
            {rankings?.items?.map((book: RankedBookDetail) => (
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
  );
}
