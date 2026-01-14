/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryWithBooks } from '../models/CategoryWithBooks';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
	/**
	 * Get categories with ranked books
	 * Returns categories and the top-ranked books within each category, sorted by total book scores.
	 * @param maxCategories Maximum number of categories to return (if not specified, returns all)
	 * @param limit Maximum number of books per category (if not specified, returns all)
	 * @returns any Successful response
	 * @throws ApiError
	 */
	public static getCategoriesWithBooks(
		maxCategories?: number,
		limit?: number,
	): CancelablePromise<{
		items?: Array<CategoryWithBooks>;
	}> {
		return __request(OpenAPI, {
			method: 'GET',
			url: '/categories/with-books',
			query: {
				'max_categories': maxCategories,
				'limit': limit,
			},
			errors: {
				500: `Internal server error`,
			},
		});
	}
}
