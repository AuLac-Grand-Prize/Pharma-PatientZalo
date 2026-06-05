import { Bell, Calendar, ChevronRight, Pill, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import type { Medication } from "@/types";

const MEDS: Medication[] = [
  {
    id: "m1",
    drugName: "Metformin 850mg",
    dosage: "1 viên × 3 lần/ngày",
    schedule: ["07:30", "12:30", "19:30"],
    startDate: "01/04/2026",
    endDate: "01/07/2026",
    remainingDoses: 28,
  },
  {
    id: "m2",
    drugName: "Amlodipin 5mg",
    dosage: "1 viên / sáng",
    schedule: ["07:30"],
    startDate: "12/03/2026",
    remainingDoses: 14,
  },
  {
    id: "m3",
    drugName: "Vitamin D3 1000IU",
    dosage: "1 viên / ngày",
    schedule: ["12:30"],
    startDate: "01/04/2026",
    remainingDoses: 50,
  },
];

export default function MedicationsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Thuốc của tôi"
        right={
          <button className="grid h-9 w-9 place-items-center rounded-pill bg-brand text-white">
            <Plus className="h-4 w-4" />
          </button>
        }
      />

      <div className="space-y-4 px-4 pb-6">
        <ul className="space-y-3">
          {MEDS.map((m) => (
            <li key={m.id} className="rounded-2xl border border-line bg-white p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand">
                  <Pill className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-ink">{m.drugName}</div>
                  <div className="text-xs text-ink-muted">{m.dosage}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    {m.schedule.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-pill bg-surface px-2 py-0.5 text-[10px] text-ink-muted"
                      >
                        <Bell className="h-2.5 w-2.5" /> {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Từ {m.startDate}
                    </span>
                    {m.remainingDoses != null && (
                      <span className="rounded-pill bg-amber-50 px-2 py-0.5 text-amber-700">
                        Còn {m.remainingDoses} liều
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-subtle" />
              </div>
            </li>
          ))}
        </ul>

        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-pill border border-brand bg-white text-sm font-medium text-brand active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Thêm thuốc đang dùng
        </button>
      </div>
    </AppShell>
  );
}
