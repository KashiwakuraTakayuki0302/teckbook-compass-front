// トレンド分野の型定義
export interface TrendBook {
    id: number;
    title: string;
    coverImage: string;
}

export interface TrendCategory {
    category: string;
    icon: string;
    trendIndicator: string;
    topBooks: TrendBook[];
}

// トレンド分野のサンプルデータ
export const trendCategories: TrendCategory[] = [
    {
        category: "AI・機械学習",
        icon: "🤖",
        trendIndicator: "急上昇中",
        topBooks: [
            {
                id: 1,
                title: "ゼロから作るDeep Learning",
                coverImage: "/book1.jpg",
            },
            {
                id: 2,
                title: "機械学習エンジニアになりたい人のための本",
                coverImage: "/book2.jpg",
            },
            {
                id: 3,
                title: "Python機械学習プログラミング",
                coverImage: "/book3.jpg",
            },
        ],
    },
    {
        category: "Web開発",
        icon: "🌐",
        trendIndicator: "人気上昇",
        topBooks: [
            {
                id: 1,
                title: "リーダブルコード",
                coverImage: "/book1.jpg",
            },
            {
                id: 2,
                title: "良いコード/悪いコードで学ぶ設計入門",
                coverImage: "/book2.jpg",
            },
            {
                id: 3,
                title: "Web API: The Good Parts",
                coverImage: "/book3.jpg",
            },
        ],
    },
    {
        category: "クラウド・インフラ",
        icon: "☁️",
        trendIndicator: "注目",
        topBooks: [
            {
                id: 1,
                title: "AWSではじめるインフラ構築入門",
                coverImage: "/book1.jpg",
            },
            {
                id: 2,
                title: "Kubernetesで実践するクラウドネイティブDevOps",
                coverImage: "/book2.jpg",
            },
            {
                id: 3,
                title: "インフラエンジニアの教科書",
                coverImage: "/book3.jpg",
            },
        ],
    },
];
