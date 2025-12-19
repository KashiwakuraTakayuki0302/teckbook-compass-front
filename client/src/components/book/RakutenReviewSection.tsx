import { Star, ExternalLink } from "lucide-react";
import type { RakutenReviewSummary } from "@/api/models/RakutenReviewSummary";

interface RakutenReviewSectionProps {
  rakutenReviewSummary: RakutenReviewSummary;
  rakutenUrl?: string;
}

function renderStars(rating: number) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export function RakutenReviewSection({
  rakutenReviewSummary,
  rakutenUrl,
}: RakutenReviewSectionProps) {

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">楽天レビュー</h3>
        <div className="flex items-center gap-2">
          {renderStars(rakutenReviewSummary.averageRating ?? 0)}
          <span className="font-semibold">
            {rakutenReviewSummary.averageRating?.toFixed(1) ?? "-"}
          </span>
          <span className="text-sm text-muted-foreground">
            ({rakutenReviewSummary.totalReviews ?? 0}件)
          </span>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
        <p className="text-muted-foreground mb-3">
          楽天での購入者による詳細なレビューを確認できます。
        </p>
        {rakutenUrl && (
          <a
            href={rakutenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            楽天でレビューを見る
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
