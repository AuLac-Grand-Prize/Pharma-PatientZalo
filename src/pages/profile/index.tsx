import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  Globe,
  HeartPulse,
  LogOut,
  Settings,
  ShieldCheck,
  Type,
  Vibrate,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { usePreferences, type FontScale } from "@/store/usePreferences";
import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/cn";

const FONT_LABEL: Record<FontScale, string> = {
  default: "Bình thường",
  large: "Lớn",
  xlarge: "Rất lớn",
};

export default function ProfilePage() {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const fontScale = usePreferences((s) => s.fontScale);
  const setFontScale = usePreferences((s) => s.setFontScale);
  const hapticsEnabled = usePreferences((s) => s.hapticsEnabled);
  const toggleHaptics = usePreferences((s) => s.toggleHaptics);

  const initials =
    user?.name
      ?.split(" ")
      .slice(-2)
      .map((s) => s[0])
      .join("")
      .toUpperCase() ?? "??";

  function handleLogout() {
    if (confirm("Bạn có chắc muốn đăng xuất khỏi PharmLink AI?")) {
      haptic("medium");
      signOut();
    }
  }

  return (
    <AppShell>
      <PageHeader title="Hồ sơ" />

      <div className="space-y-5 px-4 pb-6">
        <section className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-14 w-14 rounded-pill object-cover" />
          ) : (
            <div className="grid h-14 w-14 place-items-center rounded-pill bg-gradient-to-br from-brand to-accent text-lg font-bold text-white">
              {initials}
            </div>
          )}
          <div className="flex-1">
            <div className="text-base font-semibold text-ink">{user?.name ?? "Chưa đăng nhập"}</div>
            <div className="text-xs text-ink-muted">
              {user?.phoneMasked ?? "Chưa liên kết SĐT"}
            </div>
            <div className="mt-1 inline-flex rounded-pill bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Đã liên kết Zalo
            </div>
          </div>
        </section>

        <section>
          <div className="px-1 pb-2 text-xs font-medium uppercase tracking-wider text-ink-subtle">
            Sức khỏe
          </div>
          <ul className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
            {[
              { label: "Hồ sơ y tế", icon: FileText, to: "/my-health" },
              { label: "Bệnh nền & dị ứng", icon: HeartPulse },
              { label: "Lịch sử tiêm chủng", icon: ShieldCheck },
            ].map((it, i, arr) => (
              <li key={it.label}>
                <button
                  onClick={() => {
                    if (it.to) {
                      haptic("light");
                      nav(it.to);
                    }
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-surface"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-ink-muted">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-sm text-ink">{it.label}</span>
                  <ChevronRight className="h-4 w-4 text-ink-subtle" />
                </button>
                {i < arr.length - 1 && <div className="ml-16 border-t border-line" />}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="px-1 pb-2 text-xs font-medium uppercase tracking-wider text-ink-subtle">
            Hỗ trợ tiếp cận
          </div>
          <div className="space-y-3 rounded-2xl border border-line bg-white p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand">
                <Type className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-ink">Cỡ chữ</div>
                <div className="text-xs text-ink-muted">
                  Tốt cho người cao tuổi · hiện tại: {FONT_LABEL[fontScale]}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["default", "large", "xlarge"] as const).map((s) => {
                const active = fontScale === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      haptic("light");
                      setFontScale(s);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-pill border px-2 py-2 text-sm transition-colors",
                      active
                        ? "border-brand bg-brand-50 text-brand"
                        : "border-line bg-white text-ink-muted",
                    )}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                    <span className={s === "default" ? "text-sm" : s === "large" ? "text-base" : "text-lg"}>
                      A
                    </span>
                    <span className="text-xs">{FONT_LABEL[s]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <div className="px-1 pb-2 text-xs font-medium uppercase tracking-wider text-ink-subtle">
            Cài đặt
          </div>
          <ul className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
            <li className="flex items-center gap-3 px-4 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-ink-muted">
                <Vibrate className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-ink">Phản hồi rung</div>
                <div className="text-xs text-ink-muted">Khi chạm các nút quan trọng</div>
              </div>
              <button
                role="switch"
                aria-checked={hapticsEnabled}
                onClick={() => {
                  toggleHaptics();
                  haptic(hapticsEnabled ? "light" : "success");
                }}
                className={cn(
                  "relative h-6 w-11 rounded-pill transition-colors",
                  hapticsEnabled ? "bg-brand" : "bg-slate-300",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 grid h-5 w-5 place-items-center rounded-pill bg-white shadow-soft transition-transform",
                    hapticsEnabled ? "translate-x-5" : "translate-x-0.5",
                  )}
                />
              </button>
            </li>
            <div className="ml-16 border-t border-line" />
            {[
              { label: "Ngôn ngữ · Tiếng Việt", icon: Globe },
              { label: "Thông báo", icon: Bell },
              { label: "Tùy chọn ứng dụng", icon: Settings },
            ].map((it, i, arr) => (
              <li key={it.label}>
                <button className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-surface">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface text-ink-muted">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-sm text-ink">{it.label}</span>
                  <ChevronRight className="h-4 w-4 text-ink-subtle" />
                </button>
                {i < arr.length - 1 && <div className="ml-16 border-t border-line" />}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="px-1 pb-2 text-xs font-medium uppercase tracking-wider text-ink-subtle">
            Tài khoản
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-left shadow-soft active:bg-surface"
          >
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="flex-1 text-sm font-medium text-red-600">Đăng xuất</span>
          </button>
        </section>

        <p className="text-center text-xs text-ink-subtle">PharmLink AI · v0.1 · Make in Vietnam</p>
      </div>
    </AppShell>
  );
}
