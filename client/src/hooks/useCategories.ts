import { useQuery } from '@tanstack/react-query';
import { CategoriesService } from '@/api';

/**
 * Custom hook to fetch categories with books
 */
interface UseCategoriesWithBooksParams {
  maxCategories?: number;
  limit?: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  robot: "🤖",
  backend: "⚙️",
  book: "🎓",
  cloud: "☁️",
  database: "🗄️",
  web: "🌐",
  briefcase: "💼",
  devops: "🏗️",
  mobile: "📱",
  shield: "🔒",
};

const getCategoryIcon = (key: string): string => {
  return CATEGORY_ICONS[key] || "📚";
};

export const useCategoriesWithBooks = ({
  maxCategories,
  limit,
}: UseCategoriesWithBooksParams = {}) => {
  return useQuery({
    queryKey: ['categories', 'with-books', { maxCategories, limit }],
    queryFn: () => CategoriesService.getCategoriesWithBooks(maxCategories, limit),
    select: (data) => ({
      ...data,
      items: data.items?.map((category) => ({
        ...category,
        icon: getCategoryIcon(category.icon),
      })),
    }),
  });
};
