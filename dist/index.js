// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// shared/const.ts
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";

// server/db.ts
var users = [];
var books = [];
var categories = [];
var tags = [];
var bookTags = [];
var bookCategories = [];
var reviews = [];
var bookmarks = [];
var userIdCounter = 1;
var bookIdCounter = 1;
var categoryIdCounter = 1;
var tagIdCounter = 1;
var bookTagIdCounter = 1;
var bookCategoryIdCounter = 1;
var reviewIdCounter = 1;
var bookmarkIdCounter = 1;
function initializeMockData() {
  const initialCategories = [
    { name: "Web Development", icon: "\u{1F310}", description: "Frontend, Backend, Fullstack", trendScore: 100 },
    { name: "Mobile Development", icon: "\u{1F4F1}", description: "iOS, Android, Cross-platform", trendScore: 80 },
    { name: "AI & Machine Learning", icon: "\u{1F916}", description: "Deep Learning, NLP, GenAI", trendScore: 95 },
    { name: "DevOps", icon: "\u{1F680}", description: "CI/CD, Cloud, Infrastructure", trendScore: 70 },
    { name: "Database", icon: "\u{1F4BE}", description: "SQL, NoSQL, NewSQL", trendScore: 60 }
  ];
  for (const cat of initialCategories) {
    createCategory(cat);
  }
  const initialTags = ["React", "TypeScript", "Node.js", "Python", "Docker", "AWS", "Next.js", "Vue.js"];
  for (const tag of initialTags) {
    getOrCreateTag(tag);
  }
  const initialBooks = [
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas, Andrew Hunt",
      publishDate: "2019-09-13",
      isbn: "978-0135957059",
      description: "Your journey to mastery. The Pragmatic Programmer is one of those rare tech books you\u2019ll read, re-read, and read again over the years.",
      coverImageUrl: "https://m.media-amazon.com/images/I/71f743sOPoL._AC_UF1000,1000_QL80_.jpg",
      qiitaMentions: 150,
      averageRating: 4.8,
      reviewCount: 25,
      amazonUrl: "https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052"
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
      reviewCount: 40
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
      reviewCount: 30
    }
  ];
  for (const book of initialBooks) {
    createBook(book).then((id) => {
      addBookCategory(id, 1);
      addBookTag(id, 1);
    });
  }
}
initializeMockData();
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const existingUserIndex = users.findIndex((u) => u.openId === user.openId);
  const now = /* @__PURE__ */ new Date();
  if (existingUserIndex >= 0) {
    const existing = users[existingUserIndex];
    users[existingUserIndex] = {
      ...existing,
      ...user,
      lastSignedIn: user.lastSignedIn || now,
      updatedAt: now,
      // Ensure role logic is preserved
      role: user.role || (user.openId === ENV.ownerOpenId ? "admin" : existing.role)
    };
  } else {
    const newUser = {
      id: userIdCounter++,
      openId: user.openId,
      name: user.name || null,
      email: user.email || null,
      loginMethod: user.loginMethod || null,
      role: user.role || (user.openId === ENV.ownerOpenId ? "admin" : "user"),
      createdAt: now,
      updatedAt: now,
      lastSignedIn: user.lastSignedIn || now
    };
    users.push(newUser);
  }
}
async function getUserByOpenId(openId) {
  return users.find((u) => u.openId === openId);
}
async function getAllBooks(limit = 50, offset = 0) {
  return books.sort((a, b) => b.qiitaMentions - a.qiitaMentions).slice(offset, offset + limit);
}
async function getBookById(id) {
  return books.find((b) => b.id === id);
}
async function searchBooks(query, limit = 20) {
  const lowerQuery = query.toLowerCase();
  return books.filter((b) => b.title.toLowerCase().includes(lowerQuery)).sort((a, b) => b.qiitaMentions - a.qiitaMentions).slice(0, limit);
}
async function createBook(book) {
  const now = /* @__PURE__ */ new Date();
  const newBook = {
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
    updatedAt: now
  };
  books.push(newBook);
  return newBook.id;
}
async function updateBook(id, bookUpdate) {
  const index = books.findIndex((b) => b.id === id);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      ...bookUpdate,
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
}
async function getAllCategories() {
  return categories.sort((a, b) => b.trendScore - a.trendScore);
}
async function getTrendingCategories(limit = 3) {
  return categories.sort((a, b) => b.trendScore - a.trendScore).slice(0, limit);
}
async function createCategory(category) {
  const now = /* @__PURE__ */ new Date();
  const newCategory = {
    id: categoryIdCounter++,
    name: category.name,
    icon: category.icon || null,
    description: category.description || null,
    trendScore: category.trendScore || 0,
    createdAt: now,
    updatedAt: now
  };
  categories.push(newCategory);
  return newCategory.id;
}
async function getAllTags() {
  return tags;
}
async function getOrCreateTag(name) {
  const existing = tags.find((t2) => t2.name === name);
  if (existing) {
    return existing.id;
  }
  const newTag = {
    id: tagIdCounter++,
    name,
    createdAt: /* @__PURE__ */ new Date()
  };
  tags.push(newTag);
  return newTag.id;
}
async function getBookTags(bookId) {
  const relatedTags = bookTags.filter((bt) => bt.bookId === bookId).map((bt) => tags.find((t2) => t2.id === bt.tagId)).filter((t2) => !!t2);
  return relatedTags.map((t2) => ({ id: t2.id, name: t2.name }));
}
async function addBookTag(bookId, tagId) {
  const exists = bookTags.some((bt) => bt.bookId === bookId && bt.tagId === tagId);
  if (!exists) {
    bookTags.push({
      id: bookTagIdCounter++,
      bookId,
      tagId,
      createdAt: /* @__PURE__ */ new Date()
    });
  }
}
async function getBookCategories(bookId) {
  const relatedCategories = bookCategories.filter((bc) => bc.bookId === bookId).map((bc) => categories.find((c) => c.id === bc.categoryId)).filter((c) => !!c);
  return relatedCategories.map((c) => ({ id: c.id, name: c.name, icon: c.icon }));
}
async function getBooksByCategory(categoryId, limit = 10) {
  const bookIds = bookCategories.filter((bc) => bc.categoryId === categoryId).map((bc) => bc.bookId);
  return books.filter((b) => bookIds.includes(b.id)).sort((a, b) => b.qiitaMentions - a.qiitaMentions).slice(0, limit);
}
async function addBookCategory(bookId, categoryId) {
  const exists = bookCategories.some((bc) => bc.bookId === bookId && bc.categoryId === categoryId);
  if (!exists) {
    bookCategories.push({
      id: bookCategoryIdCounter++,
      bookId,
      categoryId,
      createdAt: /* @__PURE__ */ new Date()
    });
  }
}
async function getBookReviews(bookId) {
  const bookReviews = reviews.filter((r) => r.bookId === bookId);
  return bookReviews.map((r) => {
    const user = users.find((u) => u.id === r.userId);
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      userName: user ? user.name : "Unknown User"
    };
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
async function createReview(review) {
  const now = /* @__PURE__ */ new Date();
  const newReview = {
    id: reviewIdCounter++,
    bookId: review.bookId,
    userId: review.userId,
    rating: review.rating,
    comment: review.comment || null,
    createdAt: now,
    updatedAt: now
  };
  reviews.push(newReview);
  await updateBookRating(review.bookId);
  return newReview.id;
}
async function updateBookRating(bookId) {
  const bookReviews = reviews.filter((r) => r.bookId === bookId);
  if (bookReviews.length > 0) {
    const totalRating = bookReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / bookReviews.length;
    await updateBook(bookId, {
      averageRating: avgRating,
      reviewCount: bookReviews.length
    });
  }
}
async function getUserBookmarks(userId) {
  const userBookmarks = bookmarks.filter((b) => b.userId === userId);
  return userBookmarks.map((bm) => {
    const book = books.find((b) => b.id === bm.bookId);
    if (!book) return null;
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      coverImageUrl: book.coverImageUrl,
      bookmarkedAt: bm.createdAt
    };
  }).filter((item) => !!item).sort((a, b) => b.bookmarkedAt.getTime() - a.bookmarkedAt.getTime());
}
async function isBookmarked(userId, bookId) {
  return bookmarks.some((b) => b.userId === userId && b.bookId === bookId);
}
async function addBookmark(userId, bookId) {
  if (await isBookmarked(userId, bookId)) return;
  bookmarks.push({
    id: bookmarkIdCounter++,
    userId,
    bookId,
    createdAt: /* @__PURE__ */ new Date()
  });
}
async function removeBookmark(userId, bookId) {
  const index = bookmarks.findIndex((b) => b.userId === userId && b.bookId === bookId);
  if (index !== -1) {
    bookmarks.splice(index, 1);
  }
}

// server/storage.ts
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  // Books router
  books: router({
    list: publicProcedure.input(z2.object({
      limit: z2.number().optional().default(50),
      offset: z2.number().optional().default(0)
    })).query(async ({ input }) => {
      return await getAllBooks(input.limit, input.offset);
    }),
    get: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      const book = await getBookById(input.id);
      if (!book) {
        throw new Error("Book not found");
      }
      const tags2 = await getBookTags(input.id);
      const categories2 = await getBookCategories(input.id);
      const reviews2 = await getBookReviews(input.id);
      return {
        ...book,
        tags: tags2,
        categories: categories2,
        reviews: reviews2
      };
    }),
    search: publicProcedure.input(z2.object({
      query: z2.string(),
      limit: z2.number().optional().default(20)
    })).query(async ({ input }) => {
      return await searchBooks(input.query, input.limit);
    }),
    create: protectedProcedure.input(z2.object({
      title: z2.string(),
      author: z2.string().optional(),
      publishDate: z2.string().optional(),
      isbn: z2.string().optional(),
      description: z2.string().optional(),
      amazonUrl: z2.string().optional(),
      rakutenUrl: z2.string().optional(),
      qiitaMentions: z2.number().optional().default(0),
      categoryIds: z2.array(z2.number()).optional(),
      tagNames: z2.array(z2.string()).optional()
    })).mutation(async ({ input, ctx }) => {
      const { categoryIds, tagNames, ...bookData } = input;
      const bookId = await createBook(bookData);
      if (categoryIds && categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
          await addBookCategory(bookId, categoryId);
        }
      }
      if (tagNames && tagNames.length > 0) {
        for (const tagName of tagNames) {
          const tagId = await getOrCreateTag(tagName);
          await addBookTag(bookId, tagId);
        }
      }
      return { bookId };
    }),
    uploadCover: protectedProcedure.input(z2.object({
      bookId: z2.number(),
      imageData: z2.string(),
      // base64 encoded image
      mimeType: z2.string()
    })).mutation(async ({ input, ctx }) => {
      const { bookId, imageData, mimeType } = input;
      const buffer = Buffer.from(imageData, "base64");
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const extension = mimeType.split("/")[1];
      const fileKey = `book-covers/${bookId}-${timestamp}-${randomSuffix}.${extension}`;
      const { url } = await storagePut(fileKey, buffer, mimeType);
      await updateBook(bookId, {
        coverImageUrl: url,
        coverImageKey: fileKey
      });
      return { url };
    })
  }),
  // Categories router
  categories: router({
    list: publicProcedure.query(async () => {
      return await getAllCategories();
    }),
    trending: publicProcedure.input(z2.object({
      limit: z2.number().optional().default(3)
    })).query(async ({ input }) => {
      const categories2 = await getTrendingCategories(input.limit);
      const categoriesWithBooks = await Promise.all(
        categories2.map(async (category) => {
          const books2 = await getBooksByCategory(category.id, 3);
          return {
            ...category,
            topBooks: books2
          };
        })
      );
      return categoriesWithBooks;
    }),
    create: protectedProcedure.input(z2.object({
      name: z2.string(),
      icon: z2.string().optional(),
      description: z2.string().optional(),
      trendScore: z2.number().optional().default(0)
    })).mutation(async ({ input }) => {
      const categoryId = await createCategory(input);
      return { categoryId };
    })
  }),
  // Tags router
  tags: router({
    list: publicProcedure.query(async () => {
      return await getAllTags();
    })
  }),
  // Reviews router
  reviews: router({
    create: protectedProcedure.input(z2.object({
      bookId: z2.number(),
      rating: z2.number().min(1).max(5),
      comment: z2.string().optional()
    })).mutation(async ({ input, ctx }) => {
      const reviewId = await createReview({
        bookId: input.bookId,
        userId: ctx.user.id,
        rating: input.rating,
        comment: input.comment
      });
      return { reviewId };
    })
  }),
  // Bookmarks router
  bookmarks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserBookmarks(ctx.user.id);
    }),
    check: protectedProcedure.input(z2.object({ bookId: z2.number() })).query(async ({ input, ctx }) => {
      return await isBookmarked(ctx.user.id, input.bookId);
    }),
    add: protectedProcedure.input(z2.object({ bookId: z2.number() })).mutation(async ({ input, ctx }) => {
      await addBookmark(ctx.user.id, input.bookId);
      return { success: true };
    }),
    remove: protectedProcedure.input(z2.object({ bookId: z2.number() })).mutation(async ({ input, ctx }) => {
      await removeBookmark(ctx.user.id, input.bookId);
      return { success: true };
    })
  })
});

// server/_core/sdk.ts
var SDKServer = class {
  constructor() {
    console.log("[Auth] Initialized Mock SDK");
  }
  /**
   * Mock authentication that always returns a default user
   */
  async authenticateRequest(req) {
    const mockOpenId = "mock-user-openid";
    let user = await getUserByOpenId(mockOpenId);
    if (!user) {
      await upsertUser({
        openId: mockOpenId,
        name: "Mock User",
        email: "mock@example.com",
        loginMethod: "mock",
        role: "admin",
        // Default to admin for convenience
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      user = await getUserByOpenId(mockOpenId);
    }
    if (!user) {
      throw new Error("Failed to create mock user");
    }
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/context.ts
async function createContext(opts) {
  const user = await sdk.authenticateRequest(opts.req);
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
