import { Bell, Bot, HeartPulse, Lightbulb, MapPin, Pill, ScanLine, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/cn";

interface QuickAction {
  to: string;
  label: string;
  desc: string;
  icon: typeof Pill;
  hue: string;
  iconHue: string;
}

const ACTIONS: QuickAction[] = [
  {
    to: "/drug-search",
    label: "Tra cứu thuốc",
    desc: "2,000+ hoạt chất",
    icon: Search,
    hue: "bg-brand-50",
    iconHue: "bg-brand-100 text-brand",
  },
  {
    to: "/prescription-scan",
    label: "Quét đơn thuốc",
    desc: "OCR thông minh",
    icon: ScanLine,
    hue: "bg-accent-50",
    iconHue: "bg-accent-100 text-accent",
  },
  {
    to: "/ai-chat",
    label: "Hỏi dược sĩ AI",
    desc: "Trả lời 24/7",
    icon: Bot,
    hue: "bg-violet-50",
    iconHue: "bg-violet-100 text-violet-600",
  },
  {
    to: "/pharmacy-finder",
    label: "Tìm nhà thuốc",
    desc: "Gần bạn nhất",
    icon: MapPin,
    hue: "bg-emerald-50",
    iconHue: "bg-emerald-100 text-emerald-600",
  },
];

const ACTIVITY = [
  {
    title: "Đã đặt mua Paracetamol 500mg",
    time: "2 giờ trước",
    icon: Pill,
    iconHue: "bg-brand-50 text-brand",
  },
  {
    title: "Đã quét đơn thuốc của BS. Trần",
    time: "Hôm qua",
    icon: ScanLine,
    iconHue: "bg-accent-50 text-accent",
  },
  {
    title: "Đã hỏi PharmaGPT về metformin",
    time: "3 ngày trước",
    icon: Bot,
    iconHue: "bg-violet-50 text-violet-600",
  },
];

export default function HomePage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ").slice(-1).join(" ") ?? "Bạn";
  return (
    <AppShell>
      <div className="space-y-6 px-5 pb-6 pt-2">
        <header className="flex items-center justify-between">
          <button onClick={() => nav("/")} className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent text-white">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-ink">PharmLink AI</span>
          </button>
          <button
            aria-label="Thông báo"
            className="relative grid h-10 w-10 place-items-center rounded-pill bg-surface"
          >
            <Bell className="h-4 w-4 text-ink-muted" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-pill bg-danger" />
          </button>
        </header>

        <section className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-50 to-accent-50 px-5 py-4">
          <div>
            <h1 className="text-xl font-bold text-ink">Xin chào, {firstName}!</h1>
            <p className="text-sm text-ink-muted">Hôm nay PharmLink hỗ trợ gì cho bạn?</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-pill bg-brand-100 text-brand">
            <HeartPulse className="h-6 w-6" />
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Truy cập nhanh</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {ACTIONS.map((a) => (
              <button
                key={a.to}
                onClick={() => nav(a.to)}
                className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-white p-4 text-left shadow-soft active:scale-[0.98]"
              >
                <div className={cn("grid h-10 w-10 place-items-center rounded-xl", a.iconHue)}>
                  <a.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-ink">{a.label}</div>
                  <div className="text-xs text-ink-muted">{a.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100">
              <Lightbulb className="h-5 w-5 text-brand" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-brand">
                Mẹo sức khỏe hôm nay
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink">
                Uống đủ 8 ly nước mỗi ngày giúp thận hoạt động tốt và thuốc được hấp thu hiệu quả.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Hoạt động gần đây</h2>
          <ul className="mt-3 space-y-2">
            {ACTIVITY.map((a) => (
              <li
                key={a.title}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-soft"
              >
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg", a.iconHue)}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{a.title}</div>
                  <div className="text-xs text-ink-muted">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
