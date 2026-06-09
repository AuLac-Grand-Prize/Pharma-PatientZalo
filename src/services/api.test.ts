import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Make the request interceptor's Zalo fallback deterministic.
vi.mock("@/services/zalo-auth", () => ({
  getAccessToken: vi.fn(async () => "zalo.fallback.token"),
}));

import { api } from "@/services/api";
import { getAccessToken as getZaloAccessToken } from "@/services/zalo-auth";
import { useAuthStore } from "@/store/useAuthStore";

type FulfilledRequest = (
  config: InternalAxiosRequestConfig,
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
type RejectedResponse = (error: unknown) => unknown;

/**
 * Axios stores registered interceptors on a (non-public) `handlers` array on the
 * InterceptorManager. We read it directly so we can invoke the handlers without
 * issuing real HTTP. This typed shape avoids `any` while reaching the internal.
 */
interface InterceptorHandler {
  fulfilled?: (value: unknown) => unknown;
  rejected?: (error: unknown) => unknown;
}
function handlersOf(manager: unknown): Array<InterceptorHandler | null> {
  return (manager as { handlers: Array<InterceptorHandler | null> }).handlers;
}

/** The request interceptor's `fulfilled` handler registered in api.ts. */
function requestInterceptor(): FulfilledRequest {
  const handler = handlersOf(api.interceptors.request).find((h) => h?.fulfilled);
  if (!handler?.fulfilled) throw new Error("request interceptor not registered");
  return handler.fulfilled as FulfilledRequest;
}

/** The response interceptor's `rejected` handler registered in api.ts. */
function responseRejected(): RejectedResponse {
  const handler = handlersOf(api.interceptors.response).find((h) => h?.rejected);
  if (!handler?.rejected) throw new Error("response interceptor not registered");
  return handler.rejected as RejectedResponse;
}

function makeConfig(): InternalAxiosRequestConfig {
  return {
    headers: new AxiosHeaders(),
  } as InternalAxiosRequestConfig;
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useAuthStore.getState().reset();
  vi.mocked(getZaloAccessToken).mockResolvedValue("zalo.fallback.token");
});

describe("api request interceptor (Bearer attach)", () => {
  it("attaches the store appToken as a Bearer header", async () => {
    useAuthStore.setState({ appToken: "store.app.token" });

    const config = await requestInterceptor()(makeConfig());

    expect(config.headers.get("Authorization")).toBe("Bearer store.app.token");
    // Store token present → no fallback to the Zalo SDK.
    expect(getZaloAccessToken).not.toHaveBeenCalled();
  });

  it("falls back to the zalo-auth token when the store has no appToken", async () => {
    expect(useAuthStore.getState().appToken).toBeNull();

    const config = await requestInterceptor()(makeConfig());

    expect(getZaloAccessToken).toHaveBeenCalledTimes(1);
    expect(config.headers.get("Authorization")).toBe("Bearer zalo.fallback.token");
  });
});

describe("api response interceptor (401 -> reset)", () => {
  it("resets the auth store on a 401 and still rejects", async () => {
    useAuthStore.setState({
      status: "authenticated",
      appToken: "store.app.token",
      expiresAt: Date.now() + 60_000,
    });

    const error = { response: { status: 401 } };
    await expect(responseRejected()(error)).rejects.toBe(error);

    expect(useAuthStore.getState().status).toBe("idle");
    expect(useAuthStore.getState().appToken).toBeNull();
  });

  it("does NOT reset the store on a non-401 (e.g. 500) error", async () => {
    useAuthStore.setState({
      status: "authenticated",
      appToken: "store.app.token",
      expiresAt: Date.now() + 60_000,
    });

    const error = { response: { status: 500 } };
    await expect(responseRejected()(error)).rejects.toBe(error);

    expect(useAuthStore.getState().status).toBe("authenticated");
    expect(useAuthStore.getState().appToken).toBe("store.app.token");
  });
});
