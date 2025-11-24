export * from "./_core/errors";

export interface User {
    id: number;
    openId: string;
    name: string | null;
    email: string | null;
    loginMethod: string | null;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
    lastSignedIn: Date;
}

export interface InsertUser {
    openId: string;
    name?: string | null;
    email?: string | null;
    loginMethod?: string | null;
    role?: "user" | "admin";
    lastSignedIn?: Date;
}

export interface Category {
    id: number;
    name: string;
    icon: string | null;
    description: string | null;
    trendScore: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface InsertCategory {
    name: string;
    icon?: string;
    description?: string;
    trendScore?: number;
}

export interface Book {
    id: number;
    title: string;
    author: string | null;
    publishDate: string | null;
    isbn: string | null;
    description: string | null;
    coverImageUrl: string | null;
    coverImageKey: string | null;
    amazonUrl: string | null;
    rakutenUrl: string | null;
    qiitaMentions: number;
    averageRating: number | null;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface InsertBook {
    title: string;
    author?: string;
    publishDate?: string;
    isbn?: string;
    description?: string;
    coverImageUrl?: string;
    coverImageKey?: string;
    amazonUrl?: string;
    rakutenUrl?: string;
    qiitaMentions?: number;
    averageRating?: number;
    reviewCount?: number;
}

export interface Tag {
    id: number;
    name: string;
    createdAt: Date;
}

export interface InsertTag {
    name: string;
}

export interface BookTag {
    id: number;
    bookId: number;
    tagId: number;
    createdAt: Date;
}

export interface InsertBookTag {
    bookId: number;
    tagId: number;
}

export interface BookCategory {
    id: number;
    bookId: number;
    categoryId: number;
    createdAt: Date;
}

export interface InsertBookCategory {
    bookId: number;
    categoryId: number;
}

export interface Review {
    id: number;
    bookId: number;
    userId: number;
    rating: number;
    comment: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface InsertReview {
    bookId: number;
    userId: number;
    rating: number;
    comment?: string;
}

export interface Bookmark {
    id: number;
    userId: number;
    bookId: number;
    createdAt: Date;
}

export interface InsertBookmark {
    userId: number;
    bookId: number;
}
