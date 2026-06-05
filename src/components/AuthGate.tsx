import { useEffect, type ReactNode } from "react";
import { Loader2, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { StatusBar } from "./StatusBar";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { status, signIn, error } = useAuth();
  const isExpired = useAuthStore((s) => s.isExpired);
  const reset = useAuthStore((s) => s.reset);

  useEffect(() => {
    if (status === "authenticated" && isExpired()) {
      reset();
    }
  }, [status, isExpired, reset]);

  if (status === "authenticated") return <>{children}</>;

  return (
    <div className="zalo-screen">
      <StatusBar />
      <main className="flex flex-1 flex-col px-6 pb-8 pt-4">
        <section className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand to-accent text-white shadow-soft">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">PharmLink AI</h1>
            <p className="mt-2 max-w-xs text-sm text-ink-muted">
              Đăng nhập bằng Zalo để bắt đầu chăm sóc sức khỏe của bạn cùng dược sĩ AI.
            </p>
          </div>

          <ul className="mt-2 space-y-2 text-left text-sm">
            {[
              "Tra cứu 2,000+ thuốc tiếng Việt",
              "Quét đơn thuốc viết tay tự động",
              "Hỏi dược sĩ AI 24/7",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2 text-ink-muted">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                {b}
              </li>
            ))}
          </ul>

          {error && (
            <div role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
        </section>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => signIn({ withPhone: false })}
            disabled={status === "authenticating"}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-brand text-sm font-semibold text-white shadow-soft active:scale-[0.98] disabled:opacity-60"
          >
            {status === "authenticating" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
            Đăng nhập với Zalo
          </button>
          <button
            type="button"
            onClick={() => signIn({ withPhone: true })}
            disabled={status === "authenticating"}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-pill border border-brand bg-white text-sm font-semibold text-brand active:scale-[0.98] disabled:opacity-60"
          >
            <Phone className="h-4 w-4" /> Đăng nhập + chia sẻ SĐT
          </button>
          <p className="text-center text-[11px] text-ink-subtle">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <a className="text-brand">Điều khoản</a> và{" "}
            <a className="text-brand">Chính sách bảo mật</a> của PharmLink AI.
          </p>
        </div>
      </main>
    </div>
  );
}
