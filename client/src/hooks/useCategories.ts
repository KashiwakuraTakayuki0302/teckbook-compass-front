import { useQuery } from '@tanstack/react-query';
import { CategoriesService } from '@/api';

/**
 * Custom hook to fetch categories with books
 */
export const useCategoriesWithBooks = () => {
    return useQuery({
        queryKey: ['categories', 'with-books'],
        queryFn: () => CategoriesService.getCategoriesWithBooks(),
    });
};
