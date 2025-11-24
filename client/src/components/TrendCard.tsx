import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { TrendBook } from "@/data/trendCategories";

interface TrendCardProps {
  category: string;
  icon: string;
  trendIndicator: string;
  topBooks: TrendBook[];
}

export function TrendCard({
  category,
  icon,
  trendIndicator,
  topBooks,
}: TrendCardProps) {
  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/20 border-t-4 border-t-secondary hover:scale-105">
      {/* カテゴリヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-xl font-bold text-foreground">{category}</h3>
        </div>
        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground font-semibold">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trendIndicator}
        </Badge>
      </div>

      {/* トップ3書籍 */}
      <div className="space-y-3">
        {topBooks.map((book, index) => (
          <Link key={index} href={`/book/${book.id}`}>
            <div className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer">
              <span className="text-lg font-semibold text-muted-foreground w-6">
                {index + 1}
              </span>
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-12 h-16 object-cover rounded shadow-sm"
              />
              <p className="text-sm font-medium text-foreground line-clamp-2 flex-1">
                {book.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
