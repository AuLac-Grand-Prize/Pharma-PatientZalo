import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";

/**
 * Global mock for the Zalo Mini App SDK (`zmp-sdk`).
 *
 * Several modules under `src/` import named symbols from `zmp-sdk` at module
 * scope (`src/services/zalo-auth.ts` → authorize / getAccessToken / getUserInfo
 * / getPhoneNumber; `src/lib/haptics.ts` → vibrate). Loading the real SDK under
 * Node/jsdom would attempt to reach the native Zalo client and break the suite,
 * so we register the mock here via `setupFiles` so it is applied before any test
 * module is evaluated. Every symbol returns a resolved promise with a
 * deterministic dummy value and is a spy, so tests can assert on call counts.
 *
 * `vi.mock` is hoisted to the top of the file by Vitest, so this takes effect
 * for every importer of `zmp-sdk` across the suite.
 */
vi.mock("zmp-sdk", () => ({
  authorize: vi.fn(async () => ({
    "scope.userInfo": true,
    "scope.userPhonenumber": true,
  })),
  getAccessToken: vi.fn(async () => "mock.zalo.access.token"),
  getUserInfo: vi.fn(async () => ({
    userInfo: {
      id: "mock_zalo_user",
      name: "Mock Zalo User",
      avatar: "https://example.test/avatar.png",
      idByOA: "",
      followedOA: false,
      isSensitive: false,
    },
  })),
  getPhoneNumber: vi.fn(async () => ({ token: "mock.phone.token" })),
  vibrate: vi.fn(async () => undefined),
}));

afterEach(() => {
  vi.clearAllMocks();
});
