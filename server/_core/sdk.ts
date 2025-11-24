import type { Request } from "express";
import type { User } from "@shared/types";
import * as db from "../db";
import { ENV } from "./env";

class SDKServer {
  constructor() {
    console.log("[Auth] Initialized Mock SDK");
  }

  /**
   * Mock authentication that always returns a default user
   */
  async authenticateRequest(req: Request): Promise<User> {
    const mockOpenId = "mock-user-openid";
    let user = await db.getUserByOpenId(mockOpenId);

    if (!user) {
      // Create default mock user if not exists
      await db.upsertUser({
        openId: mockOpenId,
        name: "Mock User",
        email: "mock@example.com",
        loginMethod: "mock",
        role: "admin", // Default to admin for convenience
        lastSignedIn: new Date(),
      });
      user = await db.getUserByOpenId(mockOpenId);
    }

    if (!user) {
      throw new Error("Failed to create mock user");
    }

    return user;
  }
}

export const sdk = new SDKServer();
