import { Activity, Bell, Calendar, Clock, Droplet, HeartPulse, Pill, Plus, Syringe } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/cn";

interface VitalCard {
  label: string;
  value: string;
  unit?: string;
  icon: typeof HeartPulse;
  hue: string;
  iconHue: string;
}

const VITALS: VitalCard[] = [
  {
    label: "Huyết áp",
    value: "118/76",
    unit: "mmHg",
    icon: HeartPulse,
    hue: "bg-red-50",
    iconHue: "bg-red-100 text-red-600",
  },
  {
    label: "Đường huyết",
    value: "5.6",
    unit: "mmol/L",
    icon: Droplet,
    hue: "bg-amber-50",
    iconHue: "bg-amber-100 text-amber-600",
  },
];

const REMINDERS = [
  { time: "07:30", title: "Metformin 850mg", desc: "1 viên · sau bữa sáng", taken: true },
  { time: "12:30", title: "Metformin 850mg", desc: "1 viên · sau bữa trưa", taken: true },
  { time: "19:30", title: "Metformin 850mg", desc: "1 viên · sau bữa tối", taken: false },
];

const UPCOMING = [
  { date: "05/05", title: "Tái khám nội tiết · BV Bạch Mai", icon: Calendar },
  { date: "12/05", title: "Tiêm vaccine cúm mùa", icon: Syringe },
];

export default function MyHealthPage() {
  return (
    <AppShell>
      <PageHeader
        title="Sức khỏe của tôi"
        right={
          <button aria-label="Thông báo" className="grid h-9 w-9 place-items-center rounded-pill bg-surface">
            <Bell className="h-4 w-4 text-ink-muted" />
          </button>
        }
      />

      <div className="space-y-5 px-4 pb-6">
        <section className="rounded-2xl bg-gradient-to-r from-brand to-accent p-5 text-white">
          <div className="text-xs uppercase tracking-wider text-white/80">Hôm nay</div>
          <div className="mt-1 text-2xl font-bold">Bạn ổn lắm 💪</div>
          <p className="mt-1 text-sm text-white/85">Đã uống 2/3 liều thuốc · 6,500 bước · 7h ngủ</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Chỉ số sức khỏe</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {VITALS.map((v) => (
              <div key={v.label} className={cn("rounded-2xl border border-line p-4 shadow-soft", v.hue)}>
                <div className="flex items-center justify-between">
                  <div className={cn("grid h-9 w-9 place-items-center rounded-xl", v.iconHue)}>
                    <v.icon className="h-4 w-4" />
                  </div>
                  <Activity className="h-3 w-3 text-ink-subtle" />
                </div>
                <div className="mt-3 text-xs text-ink-muted">{v.label}</div>
                <div className="mt-0.5 text-xl font-bold text-ink">
                  {v.value}{" "}
                  {v.unit && <span className="text-xs font-normal text-ink-muted">{v.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">Lịch uống thuốc</h2>
            <button className="flex items-center gap-1 text-xs font-medium text-brand">
              <Plus className="h-3 w-3" /> Thêm
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {REMINDERS.map((r) => (
              <li
                key={r.time}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-soft",
                  r.taken ? "border-emerald-200" : "border-line",
                )}
              >
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    r.taken ? "bg-emerald-100 text-emerald-600" : "bg-brand-100 text-brand",
                  )}
                >
                  <Pill className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-ink">{r.title}</div>
                  <div className="text-xs text-ink-muted">{r.desc}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-ink-muted">
                  <Clock className="h-3 w-3" /> {r.time}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">Lịch hẹn sắp tới</h2>
          <ul className="mt-3 space-y-2">
            {UPCOMING.map((u) => (
              <li
                key={u.title}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-soft"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-600">
                  <u.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink">{u.title}</div>
                  <div className="text-xs text-ink-muted">Ngày {u.date}/2026</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
