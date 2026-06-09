import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/store/useAuthStore";
import type { AppUser } from "@/services/auth-api";

const sampleUser: AppUser = {
  id: "user_1",
  zaloId: "zalo_1",
  name: "Nguyễn Văn A",
  avatar: "https://example.test/a.png",
  phoneMasked: "090***892",
  hasMedicalProfile: true,
};

beforeEach(() => {
  localStorage.clear();
  useAuthStore.getState().reset();
});

describe("useAuthStore", () => {
  it("starts at the idle defaults", () => {
    const s = useAuthStore.getState();
    expect(s.status).toBe("idle");
    expect(s.user).toBeNull();
    expect(s.appToken).toBeNull();
    expect(s.expiresAt).toBeNull();
    expect(s.error).toBeNull();
  });

  it("setAuthenticated sets status authenticated and clears error", () => {
    // Seed an error first to prove it is cleared.
    useAuthStore.getState().setError("boom");
    expect(useAuthStore.getState().error).toBe("boom");

    const expiresAt = Date.now() + 60_000;
    useAuthStore
      .getState()
      .setAuthenticated({ user: sampleUser, appToken: "app.token", expiresAt });

    const s = useAuthStore.getState();
    expect(s.status).toBe("authenticated");
    expect(s.user).toEqual(sampleUser);
    expect(s.appToken).toBe("app.token");
    expect(s.expiresAt).toBe(expiresAt);
    expect(s.error).toBeNull();
  });

  it("setError sets status error and the message", () => {
    useAuthStore.getState().setError("Đăng nhập thất bại");
    const s = useAuthStore.getState();
    expect(s.status).toBe("error");
    expect(s.error).toBe("Đăng nhập thất bại");
  });

  it("reset returns every field to the idle defaults", () => {
    useAuthStore.getState().setAuthenticated({
      user: sampleUser,
      appToken: "app.token",
      expiresAt: Date.now() + 60_000,
    });

    useAuthStore.getState().reset();

    const s = useAuthStore.getState();
    expect(s.status).toBe("idle");
    expect(s.user).toBeNull();
    expect(s.appToken).toBeNull();
    expect(s.expiresAt).toBeNull();
    expect(s.error).toBeNull();
  });

  describe("isExpired()", () => {
    it("is true when expiresAt is null", () => {
      useAuthStore.setState({ expiresAt: null });
      expect(useAuthStore.getState().isExpired()).toBe(true);
    });

    it("is true when expiresAt is in the past", () => {
      useAuthStore.setState({ expiresAt: Date.now() - 1_000 });
      expect(useAuthStore.getState().isExpired()).toBe(true);
    });

    it("is false when expiresAt is comfortably in the future", () => {
      useAuthStore.setState({ expiresAt: Date.now() + 60 * 60 * 1000 });
      expect(useAuthStore.getState().isExpired()).toBe(false);
    });
  });
});
