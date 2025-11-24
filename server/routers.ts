
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,


  // Books router
  books: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
      }))
      .query(async ({ input }) => {
        return await db.getAllBooks(input.limit, input.offset);
      }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const book = await db.getBookById(input.id);
        if (!book) {
          throw new Error("Book not found");
        }

        const tags = await db.getBookTags(input.id);
        const categories = await db.getBookCategories(input.id);
        const reviews = await db.getBookReviews(input.id);

        return {
          ...book,
          tags,
          categories,
          reviews,
        };
      }),

    search: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().optional().default(20),
      }))
      .query(async ({ input }) => {
        return await db.searchBooks(input.query, input.limit);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        author: z.string().optional(),
        publishDate: z.string().optional(),
        isbn: z.string().optional(),
        description: z.string().optional(),
        amazonUrl: z.string().optional(),
        rakutenUrl: z.string().optional(),
        qiitaMentions: z.number().optional().default(0),
        categoryIds: z.array(z.number()).optional(),
        tagNames: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { categoryIds, tagNames, ...bookData } = input;

        const bookId = await db.createBook(bookData);

        // Add categories
        if (categoryIds && categoryIds.length > 0) {
          for (const categoryId of categoryIds) {
            await db.addBookCategory(bookId, categoryId);
          }
        }

        // Add tags
        if (tagNames && tagNames.length > 0) {
          for (const tagName of tagNames) {
            const tagId = await db.getOrCreateTag(tagName);
            await db.addBookTag(bookId, tagId);
          }
        }

        return { bookId };
      }),

    uploadCover: protectedProcedure
      .input(z.object({
        bookId: z.number(),
        imageData: z.string(), // base64 encoded image
        mimeType: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { bookId, imageData, mimeType } = input;

        // Convert base64 to buffer
        const buffer = Buffer.from(imageData, 'base64');

        // Generate unique file key
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const extension = mimeType.split('/')[1];
        const fileKey = `book-covers/${bookId}-${timestamp}-${randomSuffix}.${extension}`;

        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, mimeType);

        // Update book record
        await db.updateBook(bookId, {
          coverImageUrl: url,
          coverImageKey: fileKey,
        });

        return { url };
      }),
  }),

  // Categories router
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),

    trending: publicProcedure
      .input(z.object({
        limit: z.number().optional().default(3),
      }))
      .query(async ({ input }) => {
        const categories = await db.getTrendingCategories(input.limit);

        // Get top books for each category
        const categoriesWithBooks = await Promise.all(
          categories.map(async (category) => {
            const books = await db.getBooksByCategory(category.id, 3);
            return {
              ...category,
              topBooks: books,
            };
          })
        );

        return categoriesWithBooks;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        icon: z.string().optional(),
        description: z.string().optional(),
        trendScore: z.number().optional().default(0),
      }))
      .mutation(async ({ input }) => {
        const categoryId = await db.createCategory(input);
        return { categoryId };
      }),
  }),

  // Tags router
  tags: router({
    list: publicProcedure.query(async () => {
      return await db.getAllTags();
    }),
  }),

  // Reviews router
  reviews: router({
    create: protectedProcedure
      .input(z.object({
        bookId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const reviewId = await db.createReview({
          bookId: input.bookId,
          userId: ctx.user.id,
          rating: input.rating,
          comment: input.comment,
        });

        return { reviewId };
      }),
  }),

  // Bookmarks router
  bookmarks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserBookmarks(ctx.user.id);
    }),

    check: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.isBookmarked(ctx.user.id, input.bookId);
      }),

    add: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.addBookmark(ctx.user.id, input.bookId);
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.removeBookmark(ctx.user.id, input.bookId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
