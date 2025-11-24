// 技術書ランキングの型定義
export interface BookRanking {
    id: number;
    rank: number;
    title: string;
    author: string;
    publishDate: string;
    coverImage: string;
    rating: number;
    reviewCount: number;
    qiitaMentions: number;
    tags: string[];
    amazonUrl: string;
    rakutenUrl: string;
}

// 技術書ランキングのサンプルデータ
export const bookRankings: BookRanking[] = [
    {
        id: 1,
        rank: 1,
        title: "良いコード/悪いコードで学ぶ設計入門 ―保守しやすい 成長し続けるコードの書き方",
        author: "仙塲 大也",
        publishDate: "2022-04-30",
        coverImage: "/book1.jpg",
        rating: 4.5,
        reviewCount: 234,
        qiitaMentions: 859,
        tags: ["設計", "初心者", "技術書", "ミノ駆動本"],
        amazonUrl: "https://www.amazon.co.jp",
        rakutenUrl: "https://books.rakuten.co.jp",
    },
    {
        id: 2,
        rank: 2,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        publishDate: "2008-08-01",
        coverImage: "/book2.jpg",
        rating: 4.7,
        reviewCount: 1523,
        qiitaMentions: 1245,
        tags: ["クリーンコード", "設計", "アジャイル"],
        amazonUrl: "https://www.amazon.co.jp",
        rakutenUrl: "https://books.rakuten.co.jp",
    },
    {
        id: 3,
        rank: 3,
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        publishDate: "1994-10-31",
        coverImage: "/book3.jpg",
        rating: 4.6,
        reviewCount: 892,
        qiitaMentions: 678,
        tags: ["デザインパターン", "オブジェクト指向", "設計"],
        amazonUrl: "https://www.amazon.co.jp",
        rakutenUrl: "https://books.rakuten.co.jp",
    },
    {
        id: 4,
        rank: 4,
        title: "リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック",
        author: "Dustin Boswell, Trevor Foucher",
        publishDate: "2012-06-23",
        coverImage: "/book1.jpg",
        rating: 4.4,
        reviewCount: 567,
        qiitaMentions: 1523,
        tags: ["初心者", "リーダブルコード", "新人プログラマ応援"],
        amazonUrl: "https://www.amazon.co.jp",
        rakutenUrl: "https://books.rakuten.co.jp",
    },
    {
        id: 5,
        rank: 5,
        title: "達人に学ぶDB設計 徹底指南書",
        author: "ミック",
        publishDate: "2012-03-16",
        coverImage: "/book2.jpg",
        rating: 4.3,
        reviewCount: 423,
        qiitaMentions: 789,
        tags: ["データベース", "DB設計", "SQL"],
        amazonUrl: "https://www.amazon.co.jp",
        rakutenUrl: "https://books.rakuten.co.jp",
    },
];
