import { useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ensureAuthorized,
  fetchZaloUser,
  fetchPhoneToken,
  getAccessToken,
  clearAccessTokenCache,
} from "@/services/zalo-auth";
import { loginWithZalo } from "@/services/auth-api";

interface SignInOptions {
  withPhone?: boolean;
}

export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const error = useAuthStore((s) => s.error);
  const setAuthenticating = useAuthStore((s) => s.setAuthenticating);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const setError = useAuthStore((s) => s.setError);
  const reset = useAuthStore((s) => s.reset);

  const signIn = useCallback(
    async (options: SignInOptions = {}) => {
      setAuthenticating();
      try {
        await ensureAuthorized();
        const zaloAccessToken = await getAccessToken(true);
        if (!zaloAccessToken) throw new Error("Không lấy được Zalo access token");

        const [info, phone] = await Promise.all([
          fetchZaloUser(),
          options.withPhone ? fetchPhoneToken() : Promise.resolve(null),
        ]);

        const result = await loginWithZalo({
          zaloAccessToken,
          phoneToken: phone?.token,
          userInfo: info ? { name: info.name, avatar: info.avatar } : undefined,
        });

        setAuthenticated({
          user: result.user,
          appToken: result.appToken,
          expiresAt: result.expiresAt,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
        setError(message);
      }
    },
    [setAuthenticating, setAuthenticated, setError],
  );

  const signOut = useCallback(() => {
    clearAccessTokenCache();
    reset();
  }, [reset]);

  return { status, user, error, signIn, signOut };
}
