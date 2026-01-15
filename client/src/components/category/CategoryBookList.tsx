import { BookCard } from "@/components/book/BookCard";
import { useQuery } from "@tanstack/react-query";
import { BooksService, type BookDetail } from "@/api";

interface Book {
  rank: number;
  bookId: string;
  title: string;
  thumbnail: string;
  score: number;
}

interface CategoryBookListProps {
  books: Book[];
}

export function CategoryBookList({ books }: CategoryBookListProps) {
  // 各書籍の詳細情報を並列で取得
  const bookDetailQueries = useQuery({
    queryKey: ['categoryBooks', books.map(b => b.bookId)],
    queryFn: async () => {
      const details = await Promise.allSettled(
        books.map(async (book) => {
          const detail = await BooksService.getBooks(book.bookId);
          return { bookId: book.bookId, detail };
        })
      );
      return details.reduce((acc, result, index) => {
        const bookId = books[index]?.bookId;
        if (!bookId) return acc;
        
        if (result.status === 'fulfilled') {
          const { detail } = result.value;
          acc[bookId] = detail;
        } else {
          // Promise.allSettledでrejectedの場合も処理
          console.error(`Failed to fetch book details for ${bookId}:`, result.reason);
          acc[bookId] = null;
        }
        return acc;
      }, {} as Record<string, BookDetail | null>);
    },
    enabled: books.length > 0,
  });

  const bookDetails = bookDetailQueries.data || {};

  if (bookDetailQueries.isLoading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="text-center text-muted-foreground py-8">
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      {books.map((book) => {
        const details = bookDetails[book.bookId] || {};

        return (
          <BookCard
            key={book.bookId}
            id={book.bookId}
            rank={book.rank}
            title={book.title}
            author={details?.author || ""}
            publishDate={details?.publishedDate || "不明"}
            coverImage={book.thumbnail}
            rating={details?.rakutenReviewSummary?.averageRating || 0}
            reviewCount={details?.rakutenReviewSummary?.totalReviews || 0}
            qiitaMentions={details?.qiitaArticles?.length || 0}
            tags={details?.tags || []}
            amazonUrl={details?.purchaseLinks?.amazon}
            rakutenUrl={details?.purchaseLinks?.rakuten}
          />
        );
      })}
    </div>
  );
}
