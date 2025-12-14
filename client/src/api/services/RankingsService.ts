/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RankedBookDetail } from '../models/RankedBookDetail';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RankingsService {
    /**
     * Get overall rankings of technical books
     * Returns the ranking list of technical books for a given period.
     * Default range is `all`. If limit is not specified, returns all items.
     *
     * @param range Ranking period
     * @param limit Number of ranking items to return (if not specified, returns all)
     * @param offset Offset for pagination
     * @param category Filter by category ID (optional)
     * @returns any Successful response
     * @throws ApiError
     */
    public static getRankings(
        range: 'all' | 'monthly' | 'yearly' = 'all',
        limit?: number,
        offset?: number,
        category?: string,
    ): CancelablePromise<{
        range?: string;
        items?: Array<RankedBookDetail>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rankings',
            query: {
                'range': range,
                'limit': limit,
                'offset': offset,
                'category': category,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }
}
