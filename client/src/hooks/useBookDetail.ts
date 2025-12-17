import { useQuery } from '@tanstack/react-query';
import { BooksService } from '@/api';

/**
 * Custom hook to fetch book detail
 */
export const useBookDetail = (bookId: string | undefined) => {
	return useQuery({
		queryKey: ['bookDetail', bookId],
		queryFn: () => BooksService.getBooks(bookId!),
		enabled: !!bookId,
	});
};

