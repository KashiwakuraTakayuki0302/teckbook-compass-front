import { BookCard } from "@/components/book/BookCard";
import { useQuery } from "@tanstack/react-query";
import { BooksService } from "@/api";

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
      const details = await Promise.all(
        books.map(async (book) => {
          try {
            const detail = await BooksService.getBooks(book.bookId);
            return { bookId: book.bookId, detail };
          } catch (error) {
            console.error(`Failed to fetch book details for ${book.bookId}:`, error);
            return { bookId: book.bookId, detail: null };
          }
        })
      );
      return details.reduce((acc, { bookId, detail }) => {
        acc[bookId] = detail;
        return acc;
      }, {} as Record<string, any>);
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
