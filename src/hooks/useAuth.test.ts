import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppLoginResponse } from "@/services/auth-api";

// Mock the Zalo bridge + the app-login API so no real SDK / network is touched.
vi.mock("@/services/zalo-auth", () => ({
  ensureAuthorized: vi.fn(async () => undefined),
  getAccessToken: vi.fn(async () => "zalo.access.token"),
  fetchZaloUser: vi.fn(async () => ({ name: "Zalo User", avatar: "av.png" })),
  fetchPhoneToken: vi.fn(async () => ({ token: "phone.token" })),
  clearAccessTokenCache: vi.fn(() => undefined),
}));

vi.mock("@/services/auth-api", () => ({
  loginWithZalo: vi.fn(),
}));

import {
  ensureAuthorized,
  getAccessToken,
  fetchZaloUser,
  clearAccessTokenCache,
} from "@/services/zalo-auth";
import { loginWithZalo } from "@/services/auth-api";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";

const loggedInUser: AppLoginResponse = {
  user: {
    id: "app_1",
    zaloId: "zalo_1",
    name: "Zalo User",
    avatar: "av.png",
    hasMedicalProfile: false,
  },
  appToken: "app.jwt.token",
  expiresAt: Date.now() + 60 * 60 * 1000,
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useAuthStore.getState().reset();
  vi.mocked(getAccessToken).mockResolvedValue("zalo.access.token");
  vi.mocked(loginWithZalo).mockResolvedValue(loggedInUser);
});

describe("useAuth", () => {
  it("happy path: signIn ends authenticated with the user from loginWithZalo", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(ensureAuthorized).toHaveBeenCalledTimes(1);
    expect(loginWithZalo).toHaveBeenCalledTimes(1);

    const s = useAuthStore.getState();
    expect(s.status).toBe("authenticated");
    expect(s.user).toEqual(loggedInUser.user);
    expect(s.appToken).toBe(loggedInUser.appToken);
    expect(s.error).toBeNull();
  });

  it("missing token: signIn errors and never calls loginWithZalo", async () => {
    vi.mocked(getAccessToken).mockResolvedValueOnce(null);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn();
    });

    expect(loginWithZalo).not.toHaveBeenCalled();
    // fetchZaloUser must not run either — the throw happens before Promise.all.
    expect(fetchZaloUser).not.toHaveBeenCalled();

    const s = useAuthStore.getState();
    expect(s.status).toBe("error");
    expect(s.error).toBeTruthy();
    expect(s.error?.length ?? 0).toBeGreaterThan(0);
  });

  it("sign-out: clears the Zalo token cache and leaves the store idle", async () => {
    // First sign in so there is state to clear.
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.signIn();
    });
    expect(useAuthStore.getState().status).toBe("authenticated");

    act(() => {
      result.current.signOut();
    });

    expect(clearAccessTokenCache).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().status).toBe("idle");
    expect(useAuthStore.getState().user).toBeNull();
  });
});
