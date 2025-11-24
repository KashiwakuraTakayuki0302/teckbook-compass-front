import { useCallback, useMemo } from "react";
import type { User } from "@shared/types";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

const MOCK_USER: User = {
  id: 1,
  openId: "mock-user-openid",
  name: "Mock User",
  email: "mock@example.com",
  loginMethod: "mock",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

export function useAuth(options?: UseAuthOptions) {
  // Mock logout does nothing
  const logout = useCallback(async () => {
    console.log("Mock logout called");
  }, []);

  const state = useMemo(() => {
    return {
      user: MOCK_USER,
      loading: false,
      error: null,
      isAuthenticated: true,
    };
  }, []);

  return {
    ...state,
    refresh: () => { },
    logout,
  };
}
