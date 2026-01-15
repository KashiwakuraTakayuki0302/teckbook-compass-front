import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CategoryBookList } from "./CategoryBookList";

interface CategoryAccordionProps {
  category: {
    id: string;
    name: string;
    icon: string;
    books?: Array<{
      rank: number;
      bookId: string;
      title: string;
      thumbnail: string;
      score: number;
    }>;
  };
  description: string;
}

export function CategoryAccordion({ category, description }: CategoryAccordionProps) {
  return (
    <AccordionItem value={category.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-4 flex-1">
          <span className="text-2xl md:text-3xl">{category.icon}</span>
          <div className="flex-1 text-left">
            <h3 className="text-lg md:text-xl font-semibold text-foreground">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {category.books && category.books.length > 0 ? (
          <CategoryBookList books={category.books} />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            書籍が見つかりませんでした
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
