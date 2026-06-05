import {
  authorize,
  getAccessToken as zmpGetAccessToken,
  getUserInfo as zmpGetUserInfo,
  getPhoneNumber as zmpGetPhoneNumber,
  type UserInfo,
} from "zmp-sdk";

const TOKEN_TTL_MS = 50 * 60 * 1000;

let accessTokenCache: { token: string; expiresAt: number } | null = null;

function isInZaloClient(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { ZJSBridge?: unknown; ZaloJavaScriptInterface?: unknown };
  return Boolean(w.ZJSBridge ?? w.ZaloJavaScriptInterface);
}

export function isBrowserDevMode(): boolean {
  return import.meta.env.DEV && !isInZaloClient();
}

export async function ensureAuthorized(): Promise<void> {
  if (isBrowserDevMode()) return;
  await authorize({ scopes: ["scope.userInfo", "scope.userPhonenumber"] });
}

export async function getAccessToken(force = false): Promise<string | null> {
  if (isBrowserDevMode()) {
    return "dev.zalo.token";
  }
  if (!force && accessTokenCache && accessTokenCache.expiresAt > Date.now()) {
    return accessTokenCache.token;
  }
  try {
    const token = await zmpGetAccessToken({});
    accessTokenCache = { token, expiresAt: Date.now() + TOKEN_TTL_MS };
    return token;
  } catch {
    accessTokenCache = null;
    return null;
  }
}

export function clearAccessTokenCache(): void {
  accessTokenCache = null;
}

export async function fetchZaloUser(): Promise<UserInfo | null> {
  if (isBrowserDevMode()) {
    return {
      id: "dev_user_1",
      name: "Dev Tester",
      avatar: "",
      idByOA: "",
      followedOA: false,
      isSensitive: false,
    } as unknown as UserInfo;
  }
  try {
    const result = await zmpGetUserInfo({ avatarType: "normal" });
    return result.userInfo;
  } catch {
    return null;
  }
}

export interface PhoneTokenResult {
  token: string;
}

export async function fetchPhoneToken(): Promise<PhoneTokenResult | null> {
  if (isBrowserDevMode()) {
    return { token: "dev.phone.token" };
  }
  try {
    const result = await zmpGetPhoneNumber({});
    if (!result.token) return null;
    return { token: result.token };
  } catch {
    return null;
  }
}
