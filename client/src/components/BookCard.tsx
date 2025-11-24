import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ExternalLink } from "lucide-react";

interface BookCardProps {
  rank: number;
  title: string;
  author: string;
  publishDate: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  qiitaMentions: number;
  tags: string[];
  amazonUrl?: string;
  rakutenUrl?: string;
}

export function BookCard({
  rank,
  title,
  author,
  publishDate,
  coverImage,
  rating,
  reviewCount,
  qiitaMentions,
  tags,
  amazonUrl,
  rakutenUrl,
}: BookCardProps) {
  const isTopRank = rank <= 3;

  return (
    <Card className="flex flex-col md:flex-row gap-4 p-4 md:p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
      {/* ランキング番号 */}
      <div className="flex-shrink-0 flex items-center justify-center md:justify-start md:w-16">
        <div
          className={`text-4xl md:text-6xl font-bold ${
            isTopRank ? "text-accent drop-shadow-sm" : "text-muted-foreground"
          }`}
        >
          {rank}
        </div>
      </div>

      {/* 書籍カバー画像 */}
      <div className="flex-shrink-0 flex justify-center md:justify-start">
        <img
          src={coverImage}
          alt={title}
          className="w-28 h-40 md:w-32 md:h-44 object-cover rounded shadow-md hover:shadow-xl transition-shadow"
        />
      </div>

      {/* 書籍情報 */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-lg md:text-xl font-semibold text-foreground hover:text-primary cursor-pointer">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {author} · {publishDate}
        </p>

        {/* 評価 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviewCount}件のレビュー)
          </span>
        </div>

        {/* タグ */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Qiita言及数 */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
          <span>Qiitaで{qiitaMentions}件の記事で言及</span>
        </div>
      </div>

      {/* 購入ボタン */}
      <div className="flex flex-col gap-2 justify-center md:justify-start">
        {amazonUrl && (
          <Button
            variant="default"
            size="sm"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={() => window.open(amazonUrl, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Amazon
          </Button>
        )}
        {rakutenUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(rakutenUrl, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            楽天
          </Button>
        )}
      </div>
    </Card>
  );
}
