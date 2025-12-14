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
     * Returns all categories and the top-ranked books within each category.
     * @returns any Successful response
     * @throws ApiError
     */
    public static getCategoriesWithBooks(): CancelablePromise<{
        items?: Array<CategoryWithBooks>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/categories/with-books',
            errors: {
                500: `Internal server error`,
            },
        });
    }
}
