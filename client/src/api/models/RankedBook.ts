/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RankedBook = {
    /**
     * Ranking position within the category
     */
    rank: number;
    /**
     * 書籍ID（ISBN形式）
     */
    bookId: string;
    /**
     * Book title
     */
    title: string;
    /**
     * URL to book cover image
     */
    thumbnail: string;
    /**
     * Book score
     */
    score: number;
};

