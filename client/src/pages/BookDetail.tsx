import { useRoute } from "wouter";
import { useEffect } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/common/Layout";
import { useBookDetail } from "@/hooks/useBookDetail";
import { QiitaArticlesSection } from "@/components/book/QiitaArticlesSection";
import { RakutenReviewSection } from "@/components/book/RakutenReviewSection";
import noImage from "@/assets/no-image.svg";

export default function BookDetail() {
  const [match, params] = useRoute("/book/:id");
  const bookId = params?.id;

  const { data: book, isLoading, error } = useBookDetail(bookId);

  // ページタイトルを動的に更新
  useEffect(() => {
    if (book?.title) {
      document.title = `${book.title} | 技術書コンパス`;
    }

    // クリーンアップ: コンポーネントがアンマウントされたらデフォルトのタイトルに戻す
    return () => {
      document.title = "エンジニアが本当におすすめする技術書ランキング|Qiita発・毎月更新【技術書コンパス】";
    };
  }, [book?.title]);

  // ローディング中
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // エラー時または書籍が見つからない場合
  if (!match || error || !book) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">
              {error ? "書籍の取得に失敗しました" : "書籍が見つかりません"}
            </p>
            <Button onClick={() => window.history.back()}>戻る</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // 書籍画像（APIから取得、なければプレースホルダーを使用）
  const bookImage = book.bookImage || noImage;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム: 画像とカルーセル */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {/* 書籍画像 */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={bookImage}
                  alt={book.title ?? "書籍画像"}
                  className="w-full h-96 object-contain p-4"
                  onError={(e) => {
                    e.currentTarget.src = noImage;
                  }}
                />
              </div>

              {/* 価格と購入ボタン */}
              <div className="bg-white border border-border rounded-lg p-4 space-y-4">
                {book.price && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">定価</p>
                    <p className="text-3xl font-bold text-primary">¥{book.price.toLocaleString()}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {book.purchaseLinks?.amazon && (
                    <a
                      href={book.purchaseLinks.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button className="w-full gap-2 bg-orange-500 hover:bg-orange-600">
                        <ShoppingCart size={18} />
                        Amazonで購入
                      </Button>
                    </a>
                  )}
                  {book.purchaseLinks?.rakuten && (
                    <a
                      href={book.purchaseLinks.rakuten}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white">
                        <ShoppingCart size={18} />
                        楽天で購入
                      </Button>
                    </a>
                  )}
                </div>

                {/* ISBN */}
                {book.isbn && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">ISBN</p>
                    <p className="text-sm font-mono">{book.isbn}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右カラム: 詳細情報 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 基本情報 */}
            <div>
              <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
              {book.author && <p className="text-muted-foreground mb-4">{book.author}</p>}
              {book.publishedDate && (
                <p className="text-sm text-muted-foreground">出版日: {book.publishedDate}</p>
              )}
            </div>

            {/* タグ */}
            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 概要 */}
            {book.overview && (
              <div>
                <h3 className="text-lg font-semibold mb-3">概要</h3>
                <p className="text-muted-foreground leading-relaxed">{book.overview}</p>
              </div>
            )}

            {/* Qiitaで紹介されている記事 */}
            {book.qiitaArticles && book.qiitaArticles.length > 0 && (
              <QiitaArticlesSection articles={book.qiitaArticles} />
            )}

            {/* 楽天レビュー */}
            {book.rakutenReviewSummary && book.rakutenReviewSummary.totalReviews && (
              <RakutenReviewSection
                rakutenReviewSummary={book.rakutenReviewSummary}
                rakutenUrl={book.purchaseLinks?.rakuten}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
