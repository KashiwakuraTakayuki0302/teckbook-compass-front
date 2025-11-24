// 書籍詳細情報の型定義
export interface BookDetail {
  id: number;
  title: string;
  author: string;
  publishDate: string;
  isbn: string;
  price: number;
  images: string[];
  description: string;
  summary: string;
  qiitaHighlights: string[];
  amazonRating: number;
  amazonReviewCount: number;
  amazonReviews: AmazonReview[];
  amazonUrl: string;
  rakutenUrl: string;
  tags: string[];
}

export interface AmazonReview {
  rating: number;
  title: string;
  comment: string;
  author: string;
  date: string;
}

// ダミーデータ
export const bookDetailsData: Record<number, BookDetail> = {
  1: {
    id: 1,
    title: "良いコード/悪いコードで学ぶ設計入門 ―保守しやすい成長し続けるコードの書き方",
    author: "仙塲 大也",
    publishDate: "2022-04-30",
    isbn: "978-4297125967",
    price: 3080,
    images: [
      "/book1.jpg",
      "/book1.jpg",
      "/book1.jpg",
    ],
    description: "本書は、設計の基本から実践的なテクニックまで、保守しやすく成長し続けるコードの書き方を学べる入門書です。新人プログラマから経験者まで、すべてのエンジニアに役立つ内容となっています。",
    summary: "設計の原則、SOLID原則、デザインパターンなど、実務で必要な知識を体系的に学べます。具体的なコード例を交えながら、なぜそのように設計すべきなのかを丁寧に解説しています。",
    qiitaHighlights: [
      "設計の基本が分かりやすく説明されている",
      "初心者から中級者まで学べる内容",
      "実務で即座に活かせるテクニック",
      "コードの品質向上に直結する知識",
      "チーム開発での設計思想が理解できる",
    ],
    amazonRating: 4.5,
    amazonReviewCount: 234,
    amazonReviews: [
      {
        rating: 5,
        title: "設計の本質が理解できた",
        comment: "これまで漠然と書いていたコードが、なぜダメなのかが明確に理解できました。新人教育の教材として最適です。",
        author: "エンジニア太郎",
        date: "2024-01-15",
      },
      {
        rating: 5,
        title: "実務で即座に活かせる",
        comment: "書かれている内容をチームで共有したところ、コードレビューの質が大幅に向上しました。",
        author: "開発リーダー花子",
        date: "2024-01-10",
      },
      {
        rating: 4,
        title: "初心者向けとしては最高",
        comment: "初心者向けとしては非常に分かりやすいです。ただし、より高度な内容を求める人には物足りないかもしれません。",
        author: "プログラマー次郎",
        date: "2024-01-05",
      },
    ],
    amazonUrl: "https://www.amazon.co.jp/s?k=良いコード悪いコード",
    rakutenUrl: "https://books.rakuten.co.jp/search?s=良いコード悪いコード",
    tags: ["設計", "初心者", "技術書", "クリーンコード"],
  },
  2: {
    id: 2,
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    publishDate: "2008-08-01",
    isbn: "978-0132350884",
    price: 5500,
    images: [
      "/book2.jpg",
      "/book2.jpg",
      "/book2.jpg",
    ],
    description: "ソフトウェア開発の大家ロバート・C・マーティンによる、クリーンコードの書き方に関する必読書。アジャイル開発の時代に、プロフェッショナルなエンジニアが持つべき知識と技術を網羅しています。",
    summary: "変数名の付け方から関数設計、エラーハンドリング、テストまで、実践的なコード品質向上のテクニックを詳細に解説。世界中のエンジニアから信頼されている古典的名著です。",
    qiitaHighlights: [
      "プロフェッショナルなコード品質の基準が分かる",
      "関数設計の原則が明確に説明されている",
      "テスト駆動開発の重要性が理解できる",
      "エラーハンドリングのベストプラクティス",
      "コードレビューの観点が養われる",
    ],
    amazonRating: 4.7,
    amazonReviewCount: 1523,
    amazonReviews: [
      {
        rating: 5,
        title: "ソフトウェア開発の必読書",
        comment: "この本を読まずにエンジニアを名乗るべきではないと思うほどの内容です。何度も読み返す価値があります。",
        author: "シニアエンジニア",
        date: "2024-01-20",
      },
      {
        rating: 5,
        title: "キャリアを変える一冊",
        comment: "この本を読んでからコードの質が劇的に向上しました。チーム全体で読むことをお勧めします。",
        author: "開発マネージャー",
        date: "2024-01-18",
      },
      {
        rating: 4,
        title: "古典だが今でも有効",
        comment: "出版から15年以上経っていますが、書かれている原則は今でも有効です。ただし、言語による実装例が古いのは仕方ありません。",
        author: "フロントエンドエンジニア",
        date: "2024-01-12",
      },
    ],
    amazonUrl: "https://www.amazon.co.jp/s?k=Clean+Code",
    rakutenUrl: "https://books.rakuten.co.jp/search?s=Clean+Code",
    tags: ["クリーンコード", "設計", "アジャイル"],
  },
  3: {
    id: 3,
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    publishDate: "1994-10-31",
    isbn: "978-0201633610",
    price: 6600,
    images: [
      "/book3.jpg",
      "/book3.jpg",
      "/book3.jpg",
    ],
    description: "オブジェクト指向設計における23のデザインパターンを体系的に解説した、ソフトウェア開発の古典中の古典。Gang of Fourによる必読書です。",
    summary: "Creational、Structural、Behavioralの3つのカテゴリに分類された23のデザインパターンを、詳細な説明と実装例とともに紹介。オブジェクト指向設計の基礎を理解するために必須の知識です。",
    qiitaHighlights: [
      "デザインパターンの基本が体系的に学べる",
      "オブジェクト指向設計の本質が理解できる",
      "再利用可能なコンポーネント設計の方法が分かる",
      "大規模システム設計の基礎となる知識",
      "プログラマーとしてのスキルが大幅に向上する",
    ],
    amazonRating: 4.6,
    amazonReviewCount: 892,
    amazonReviews: [
      {
        rating: 5,
        title: "ソフトウェア設計の聖書",
        comment: "30年以上前の本とは思えないほど、今でも有効な内容です。すべてのプログラマーが読むべき一冊です。",
        author: "アーキテクト",
        date: "2024-01-22",
      },
      {
        rating: 4,
        title: "難しいが価値がある",
        comment: "内容は難しいですが、理解できれば設計スキルが大幅に向上します。複数回読む価値があります。",
        author: "開発エンジニア",
        date: "2024-01-16",
      },
      {
        rating: 4,
        title: "古典として価値がある",
        comment: "古い本ですが、デザインパターンの基礎を学ぶには最適です。ただし、言語による実装例が古いのは難点です。",
        author: "プログラマー",
        date: "2024-01-08",
      },
    ],
    amazonUrl: "https://www.amazon.co.jp/s?k=Design+Patterns",
    rakutenUrl: "https://books.rakuten.co.jp/search?s=Design+Patterns",
    tags: ["デザインパターン", "オブジェクト指向", "設計"],
  },
};
