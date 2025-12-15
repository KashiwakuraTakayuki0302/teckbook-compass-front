import { useQuery } from '@tanstack/react-query';
import { RankingsService } from '@/api';

/**
 * Custom hook to fetch book rankings
 */
export const useRankings = (range: 'all' | 'monthly' | 'yearly' = 'all') => {
    return useQuery({
        queryKey: ['rankings', range],
        queryFn: () => RankingsService.getRankings(range, 50),
    });
};
