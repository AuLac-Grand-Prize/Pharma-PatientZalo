import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppUser } from "@/services/auth-api";

export type AuthStatus = "idle" | "authenticating" | "authenticated" | "error";

interface AuthState {
  status: AuthStatus;
  user: AppUser | null;
  appToken: string | null;
  expiresAt: number | null;
  error: string | null;
  setAuthenticating: () => void;
  setAuthenticated: (data: { user: AppUser; appToken: string; expiresAt: number }) => void;
  setError: (message: string) => void;
  reset: () => void;
  isExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: "idle",
      user: null,
      appToken: null,
      expiresAt: null,
      error: null,
      setAuthenticating: () => set({ status: "authenticating", error: null }),
      setAuthenticated: ({ user, appToken, expiresAt }) =>
        set({ status: "authenticated", user, appToken, expiresAt, error: null }),
      setError: (message) => set({ status: "error", error: message }),
      reset: () =>
        set({
          status: "idle",
          user: null,
          appToken: null,
          expiresAt: null,
          error: null,
        }),
      isExpired: () => {
        const { expiresAt } = get();
        return !expiresAt || Date.now() >= expiresAt;
      },
    }),
    {
      name: "pharmalink.auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        appToken: s.appToken,
        expiresAt: s.expiresAt,
        status: s.status === "authenticated" ? "authenticated" : "idle",
      }),
    },
  ),
);
