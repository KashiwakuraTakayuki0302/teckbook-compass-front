import { useState } from "react";
import { ExternalLink, Heart, Bookmark, MessageCircle } from "lucide-react";
import type { QiitaArticle } from "@/api/models/QiitaArticle";

interface QiitaArticlesSectionProps {
  articles: QiitaArticle[];
}

const INITIAL_DISPLAY_COUNT = 5;

export function QiitaArticlesSection({ articles }: QiitaArticlesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalCount = articles.length;
  const displayedArticles = isExpanded ? articles : articles.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = totalCount > INITIAL_DISPLAY_COUNT;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          📚 Qiitaで紹介されている記事
        </h3>
        <span className="text-sm text-muted-foreground">全{totalCount}件</span>
      </div>

      <div className="space-y-3">
        {displayedArticles.map((article, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-start gap-2"
            >
              <span className="flex-1">{article.title}</span>
              <ExternalLink size={16} className="flex-shrink-0 mt-1" />
            </a>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart size={14} />
                {article.likes ?? 0}件のいいね
              </span>
              <span className="flex items-center gap-1">
                <Bookmark size={14} />
                {article.stocks ?? 0}件のストック
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                {article.comments ?? 0}件のコメント
              </span>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
        >
          {isExpanded ? "閉じる" : `もっと見る（残り${totalCount - INITIAL_DISPLAY_COUNT}件）`}
        </button>
      )}
    </div>
  );
}
