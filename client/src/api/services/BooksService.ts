/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookDetail } from '../models/BookDetail';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BooksService {
    /**
     * Get book detail information
     * 指定された書籍IDの詳細情報を取得する
     * @param bookId 取得したい書籍のID
     * @returns BookDetail 書籍詳細情報の取得成功
     * @throws ApiError
     */
    public static getBooks(
        bookId: string,
    ): CancelablePromise<BookDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/books/{bookId}',
            path: {
                'bookId': bookId,
            },
            errors: {
                400: `Bad request`,
                404: `Book not found`,
                500: `Internal server error`,
            },
        });
    }
}
