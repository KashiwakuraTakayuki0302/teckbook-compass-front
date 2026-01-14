/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RankedBook } from './RankedBook';
export type CategoryWithBooks = {
    /**
     * Unique category identifier
     */
    id: string;
    /**
     * Display name of the category
     */
    name: string;
    /**
     * Identifier for frontend icon mapping
     */
    icon: string;
    /**
     * Trend indicator for the category
     */
    trendTag: CategoryWithBooks.trendTag;
    /**
     * Total score of books in this category
     */
    score: number;
    /**
     * Top ranked books in this category
     */
    books: Array<RankedBook>;
};
export namespace CategoryWithBooks {
    /**
     * Trend indicator for the category
     */
    export enum trendTag {
        HOT = 'hot',
        POPULAR = 'popular',
        ATTENTION = 'attention',
    }
}

