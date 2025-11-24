import { useState } from "react";
import { useRoute } from "wouter";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookDetailsData } from "@/data/bookDetail";

export default function BookDetail() {
  const [match, params] = useRoute("/book/:id");
  const bookId = params?.id ? parseInt(params.id) : null;
  const book = bookId ? bookDetailsData[bookId] : null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!match || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">書籍が見つかりません</p>
          <Button onClick={() => window.history.back()}>戻る</Button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % book.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + book.images.length) % book.images.length);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ChevronLeft size={20} />
            戻る
          </Button>
          <h1 className="text-lg font-semibold truncate">{book.title}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム: 画像とカルーセル */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              {/* 画像カルーセル */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={book.images[currentImageIndex]}
                  alt={book.title}
                  className="w-full h-96 object-cover"
                />
                {book.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {book.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* 価格と購入ボタン */}
              <div className="bg-white border border-border rounded-lg p-4 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">定価</p>
                  <p className="text-3xl font-bold text-primary">¥{book.price.toLocaleString()}</p>
                </div>

                <div className="space-y-2">
                  <a
                    href={book.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full gap-2 bg-orange-500 hover:bg-orange-600">
                      <ShoppingCart size={18} />
                      Amazonで購入
                    </Button>
                  </a>
                  <a
                    href={book.rakutenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <ShoppingCart size={18} />
                      楽天で購入
                    </Button>
                  </a>
                </div>

                {/* ISBN */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">ISBN</p>
                  <p className="text-sm font-mono">{book.isbn}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右カラム: 詳細情報 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 基本情報 */}
            <div>
              <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
              <p className="text-muted-foreground mb-4">{book.author}</p>
              <p className="text-sm text-muted-foreground">出版日: {book.publishDate}</p>
            </div>

            {/* タグ */}
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

            {/* 説明 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">概要</h3>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            {/* 要約 */}
            <div>
              <h3 className="text-lg font-semibold mb-3">この本について</h3>
              <p className="text-muted-foreground leading-relaxed">{book.summary}</p>
            </div>

            {/* Qiitaハイライト */}
            <div>
              <h3 className="text-lg font-semibold mb-3">📌 Qiitaで話題のポイント</h3>
              <div className="space-y-2">
                {book.qiitaHighlights.map((highlight, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                    <p className="text-sm text-gray-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amazonレビュー */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Amazonレビュー</h3>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {renderStars(book.amazonRating)}
                  </div>
                  <span className="text-sm font-semibold">{book.amazonRating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({book.amazonReviewCount}件)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {book.amazonReviews.map((review, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{review.author}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">{review.title}</h4>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <a
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Amazonですべてのレビューを見る
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
