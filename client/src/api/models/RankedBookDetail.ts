/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RankedBookDetail = {
    /**
     * Ranking position
     */
    rank: number;
    /**
     * Primary key (book ID)
     */
    id: number;
    /**
     * Book title
     */
    title: string;
    /**
     * Author name
     */
    author: string;
    /**
     * Book rating
     */
    rating: number;
    /**
     * Number of reviews
     */
    reviewCount: number;
    /**
     * Publication date
     */
    publishedAt: string;
    /**
     * URL to book cover image
     */
    thumbnail: string;
    /**
     * Tags for badge display
     */
    tags: Array<string>;
    /**
     * Number of times this book is mentioned on Qiita
     */
    qiitaMentions: number;
    /**
     * Amazon product URL
     */
    amazonUrl: string;
    /**
     * Rakuten Books URL
     */
    rakutenUrl: string;
};

