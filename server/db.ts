import {
  User, InsertUser,
  Book, InsertBook,
  Category, InsertCategory,
  Tag, InsertTag,
  BookTag, InsertBookTag,
  BookCategory, InsertBookCategory,
  Review, InsertReview,
  Bookmark, InsertBookmark
} from "@shared/types";
import { ENV } from './_core/env';

// In-memory storage
const users: User[] = [];
const books: Book[] = [];
const categories: Category[] = [];
const tags: Tag[] = [];
const bookTags: BookTag[] = [];
const bookCategories: BookCategory[] = [];
const reviews: Review[] = [];
const bookmarks: Bookmark[] = [];

// ID counters
let userIdCounter = 1;
let bookIdCounter = 1;
let categoryIdCounter = 1;
let tagIdCounter = 1;
let bookTagIdCounter = 1;
let bookCategoryIdCounter = 1;
let reviewIdCounter = 1;
let bookmarkIdCounter = 1;

// Initial Mock Data
function initializeMockData() {
  // Categories
  const initialCategories = [
    { name: "Web Development", icon: "🌐", description: "Frontend, Backend, Fullstack", trendScore: 100 },
    { name: "Mobile Development", icon: "📱", description: "iOS, Android, Cross-platform", trendScore: 80 },
    { name: "AI & Machine Learning", icon: "🤖", description: "Deep Learning, NLP, GenAI", trendScore: 95 },
    { name: "DevOps", icon: "🚀", description: "CI/CD, Cloud, Infrastructure", trendScore: 70 },
    { name: "Database", icon: "💾", description: "SQL, NoSQL, NewSQL", trendScore: 60 },
  ];

  for (const cat of initialCategories) {
    createCategory(cat);
  }

  // Tags
  const initialTags = ["React", "TypeScript", "Node.js", "Python", "Docker", "AWS", "Next.js", "Vue.js"];
  for (const tag of initialTags) {
    getOrCreateTag(tag);
  }

  // Books
  const initialBooks: InsertBook[] = [
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas, Andrew Hunt",
      publishDate: "2019-09-13",
      isbn: "978-0135957059",
      description: "Your journey to mastery. The Pragmatic Programmer is one of those rare tech books you’ll read, re-read, and read again over the years.",
      coverImageUrl: "https://m.media-amazon.com/images/I/71f743sOPoL._AC_UF1000,1000_QL80_.jpg",
      qiitaMentions: 150,
      averageRating: 4.8,
      reviewCount: 25,
      amazonUrl: "https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052",
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      publishDate: "2008-08-01",
      isbn: "978-0132350884",
      description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
      coverImageUrl: "https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UF1000,1000_QL80_.jpg",
      qiitaMentions: 200,
      averageRating: 4.7,
      reviewCount: 40,
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      publishDate: "2017-03-16",
      isbn: "978-1449373320",
      description: "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.",
      coverImageUrl: "https://m.media-amazon.com/images/I/91rr3B8Wj-L._AC_UF1000,1000_QL80_.jpg",
      qiitaMentions: 180,
      averageRating: 4.9,
      reviewCount: 30,
    }
  ];

  for (const book of initialBooks) {
    createBook(book).then(id => {
      // Assign random categories and tags
      addBookCategory(id, 1); // Web Dev
      addBookTag(id, 1); // React (just picking first tag)
    });
  }
}

// Initialize on load
initializeMockData();


// ===== User Functions =====

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const existingUserIndex = users.findIndex(u => u.openId === user.openId);
  const now = new Date();

  if (existingUserIndex >= 0) {
    // Update
    const existing = users[existingUserIndex];
    users[existingUserIndex] = {
      ...existing,
      ...user,
      lastSignedIn: user.lastSignedIn || now,
      updatedAt: now,
      // Ensure role logic is preserved
      role: user.role || (user.openId === ENV.ownerOpenId ? 'admin' : existing.role),
    };
  } else {
    // Insert
    const newUser: User = {
      id: userIdCounter++,
      openId: user.openId,
      name: user.name || null,
      email: user.email || null,
      loginMethod: user.loginMethod || null,
      role: user.role || (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
      createdAt: now,
      updatedAt: now,
      lastSignedIn: user.lastSignedIn || now,
    };
    users.push(newUser);
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  return users.find(u => u.openId === openId);
}

// ===== Book Functions =====

export async function getAllBooks(limit: number = 50, offset: number = 0): Promise<Book[]> {
  return books
    .sort((a, b) => b.qiitaMentions - a.qiitaMentions)
    .slice(offset, offset + limit);
}

export async function getBookById(id: number): Promise<Book | undefined> {
  return books.find(b => b.id === id);
}

export async function searchBooks(query: string, limit: number = 20): Promise<Book[]> {
  const lowerQuery = query.toLowerCase();
  return books
    .filter(b => b.title.toLowerCase().includes(lowerQuery))
    .sort((a, b) => b.qiitaMentions - a.qiitaMentions)
    .slice(0, limit);
}

export async function createBook(book: InsertBook): Promise<number> {
  const now = new Date();
  const newBook: Book = {
    id: bookIdCounter++,
    title: book.title,
    author: book.author || null,
    publishDate: book.publishDate || null,
    isbn: book.isbn || null,
    description: book.description || null,
    coverImageUrl: book.coverImageUrl || null,
    coverImageKey: book.coverImageKey || null,
    amazonUrl: book.amazonUrl || null,
    rakutenUrl: book.rakutenUrl || null,
    qiitaMentions: book.qiitaMentions || 0,
    averageRating: book.averageRating || 0,
    reviewCount: book.reviewCount || 0,
    createdAt: now,
    updatedAt: now,
  };
  books.push(newBook);
  return newBook.id;
}

export async function updateBook(id: number, bookUpdate: Partial<InsertBook>): Promise<void> {
  const index = books.findIndex(b => b.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      ...bookUpdate,
      updatedAt: new Date(),
    };
  }
}

export async function deleteBook(id: number): Promise<void> {
  const index = books.findIndex(b => b.id === id);
  if (index !== -1) {
    books.splice(index, 1);
  }
}

// ===== Category Functions =====

export async function getAllCategories(): Promise<Category[]> {
  return categories.sort((a, b) => b.trendScore - a.trendScore);
}

export async function getTrendingCategories(limit: number = 3): Promise<Category[]> {
  return categories
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit);
}

export async function createCategory(category: InsertCategory): Promise<number> {
  const now = new Date();
  const newCategory: Category = {
    id: categoryIdCounter++,
    name: category.name,
    icon: category.icon || null,
    description: category.description || null,
    trendScore: category.trendScore || 0,
    createdAt: now,
    updatedAt: now,
  };
  categories.push(newCategory);
  return newCategory.id;
}

// ===== Tag Functions =====

export async function getAllTags(): Promise<Tag[]> {
  return tags;
}

export async function getOrCreateTag(name: string): Promise<number> {
  const existing = tags.find(t => t.name === name);
  if (existing) {
    return existing.id;
  }

  const newTag: Tag = {
    id: tagIdCounter++,
    name,
    createdAt: new Date(),
  };
  tags.push(newTag);
  return newTag.id;
}

// ===== BookTag Functions =====

export async function getBookTags(bookId: number): Promise<{ id: number; name: string }[]> {
  const relatedTags = bookTags
    .filter(bt => bt.bookId === bookId)
    .map(bt => tags.find(t => t.id === bt.tagId))
    .filter((t): t is Tag => !!t);

  return relatedTags.map(t => ({ id: t.id, name: t.name }));
}

export async function addBookTag(bookId: number, tagId: number): Promise<void> {
  const exists = bookTags.some(bt => bt.bookId === bookId && bt.tagId === tagId);
  if (!exists) {
    bookTags.push({
      id: bookTagIdCounter++,
      bookId,
      tagId,
      createdAt: new Date(),
    });
  }
}

// ===== BookCategory Functions =====

export async function getBookCategories(bookId: number): Promise<{ id: number; name: string; icon: string | null }[]> {
  const relatedCategories = bookCategories
    .filter(bc => bc.bookId === bookId)
    .map(bc => categories.find(c => c.id === bc.categoryId))
    .filter((c): c is Category => !!c);

  return relatedCategories.map(c => ({ id: c.id, name: c.name, icon: c.icon }));
}

export async function getBooksByCategory(categoryId: number, limit: number = 10): Promise<Book[]> {
  const bookIdSet = new Set(
    bookCategories
      .filter(bc => bc.categoryId === categoryId)
      .map(bc => bc.bookId)
  );

  return books
    .filter(b => bookIdSet.has(b.id))
    .sort((a, b) => b.qiitaMentions - a.qiitaMentions)
    .slice(0, limit);
}

export async function addBookCategory(bookId: number, categoryId: number): Promise<void> {
  const exists = bookCategories.some(bc => bc.bookId === bookId && bc.categoryId === categoryId);
  if (!exists) {
    bookCategories.push({
      id: bookCategoryIdCounter++,
      bookId,
      categoryId,
      createdAt: new Date(),
    });
  }
}

// ===== Review Functions =====

export async function getBookReviews(bookId: number): Promise<{ id: number; rating: number; comment: string | null; createdAt: Date; userName: string | null }[]> {
  const bookReviews = reviews.filter(r => r.bookId === bookId);

  return bookReviews
    .map(r => {
      const user = users.find(u => u.id === r.userId);
      return {
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        userName: user ? user.name : "Unknown User",
      };
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createReview(review: InsertReview): Promise<number> {
  const now = new Date();
  const newReview: Review = {
    id: reviewIdCounter++,
    bookId: review.bookId,
    userId: review.userId,
    rating: review.rating,
    comment: review.comment || null,
    createdAt: now,
    updatedAt: now,
  };
  reviews.push(newReview);

  await updateBookRating(review.bookId);

  return newReview.id;
}

async function updateBookRating(bookId: number): Promise<void> {
  const bookReviews = reviews.filter(r => r.bookId === bookId);
  if (bookReviews.length > 0) {
    const totalRating = bookReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / bookReviews.length;

    await updateBook(bookId, {
      averageRating: avgRating,
      reviewCount: bookReviews.length,
    });
  }
}

// ===== Bookmark Functions =====

export async function getUserBookmarks(userId: number): Promise<{ id: number; title: string; author: string | null; coverImageUrl: string | null; bookmarkedAt: Date }[]> {
  const userBookmarks = bookmarks.filter(b => b.userId === userId);

  return userBookmarks
    .map(bm => {
      const book = books.find(b => b.id === bm.bookId);
      if (!book) return null;
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        coverImageUrl: book.coverImageUrl,
        bookmarkedAt: bm.createdAt,
      };
    })
    .filter((item): item is NonNullable<typeof item> => !!item)
    .sort((a, b) => b.bookmarkedAt.getTime() - a.bookmarkedAt.getTime());
}

export async function isBookmarked(userId: number, bookId: number): Promise<boolean> {
  return bookmarks.some(b => b.userId === userId && b.bookId === bookId);
}

export async function addBookmark(userId: number, bookId: number): Promise<void> {
  if (await isBookmarked(userId, bookId)) return;

  bookmarks.push({
    id: bookmarkIdCounter++,
    userId,
    bookId,
    createdAt: new Date(),
  });
}

export async function removeBookmark(userId: number, bookId: number): Promise<void> {
  const index = bookmarks.findIndex(b => b.userId === userId && b.bookId === bookId);
  if (index !== -1) {
    bookmarks.splice(index, 1);
  }
}
