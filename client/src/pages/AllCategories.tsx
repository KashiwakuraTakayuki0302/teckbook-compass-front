import { useEffect } from "react";
import { Layout } from "@/components/common/Layout";
import { Accordion } from "@/components/ui/accordion";
import { useCategoriesWithBooks } from "@/hooks/useCategories";
import { CategoryAccordion } from "@/components/category/CategoryAccordion";
import type { CategoryWithBooks } from "@/api";

// カテゴリの説明文マッピング
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "AI / 機械学習": "機械学習とAI技術に関する書籍",
  "Web / フロントエンド": "Webとフロントエンド開発に関する書籍",
  "モバイル / アプリ開発": "モバイルアプリ開発に関する書籍",
  "クラウド (AWS / GCP / Azure)": "クラウドプラットフォームに関する書籍",
  "インフラ / DevOps": "インフラとDevOpsに関する書籍",
  "バックエンド / API / Webアーキテクチャ": "バックエンド開発とWebアーキテクチャに関する書籍",
  "データベース / データエンジニアリング": "データベースとデータエンジニアリングに関する書籍",
  "セキュリティ": "セキュリティに関する書籍",
  "プログラミング入門 / CS基礎": "プログラミング入門とコンピュータサイエンス基礎に関する書籍",
  "PM / プロダクト / ビジネス・キャリア": "プロダクト管理とビジネス・キャリアに関する書籍",
};

export default function AllCategories() {
  useEffect(() => {
    document.title = "全カテゴリ | 技術書コンパス";
  }, []);

  const { data: categories, isLoading, isError } = useCategoriesWithBooks({ limit: 3 }); // limit: 3で各カテゴリのTop3を取得

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            今流行りのカテゴリ
          </h1>
          <p className="text-lg text-muted-foreground">
            今流行りの技術分野から、各カテゴリのTop3の技術書を確認できます
          </p>
        </div>

        {/* カテゴリリスト */}
        {isError ? (
          <div className="text-center text-red-500">情報の取得に失敗しました</div>
        ) : isLoading ? (
          <div className="text-center">読み込み中...</div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Accordion type="multiple" className="w-full">
              {categories?.items?.map((category: CategoryWithBooks) => (
                <CategoryAccordion
                  key={category.id}
                  category={category}
                  description={CATEGORY_DESCRIPTIONS[category.name] || `${category.name}に関する書籍`}
                />
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </Layout>
  );
}
