/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PurchaseLinks } from './PurchaseLinks';
import type { QiitaArticle } from './QiitaArticle';
import type { RakutenReviewSummary } from './RakutenReviewSummary';
export type BookDetail = {
    /**
     * 書籍ID（ISBN形式）
     */
    bookId?: string;
    /**
     * 書籍タイトル
     */
    title?: string;
    /**
     * 著者名
     */
    author?: string;
    /**
     * 出版日
     */
    publishedDate?: string;
    /**
     * 価格
     */
    price?: number;
    /**
     * ISBN
     */
    isbn?: string;
    /**
     * 書籍画像URL
     */
    bookImage?: string;
    /**
     * タグ配列
     */
    tags?: Array<string>;
    /**
     * 書籍の概要
     */
    overview?: string;
    /**
     * Qiita で本を紹介している記事の一覧
     */
    qiitaArticles?: Array<QiitaArticle>;
    rakutenReviewSummary?: RakutenReviewSummary;
    purchaseLinks?: PurchaseLinks;
};

