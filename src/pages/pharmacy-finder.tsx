import { useState } from "react";
import { Clock, MapPin, Navigation, Phone, Search, Star } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/cn";
import type { Pharmacy } from "@/types";

const PHARMACIES: Pharmacy[] = [
  { id: "1", name: "Nhà thuốc Long Châu", address: "12 Trần Duy Hưng, Cầu Giấy", distanceKm: 0.4, isOpen: true, rating: 4.8, hasStock: true },
  { id: "2", name: "Pharmacity 24h", address: "85 Nguyễn Chí Thanh, Đống Đa", distanceKm: 0.9, isOpen: true, rating: 4.6, hasStock: true },
  { id: "3", name: "Nhà thuốc An Khang", address: "23 Láng Hạ, Ba Đình", distanceKm: 1.6, isOpen: false, rating: 4.5, hasStock: false },
  { id: "4", name: "Nhà thuốc Phano", address: "150 Cầu Giấy, Cầu Giấy", distanceKm: 2.1, isOpen: true, rating: 4.4, hasStock: true },
];

export default function PharmacyFinderPage() {
  const [query, setQuery] = useState("");
  const filtered = query
    ? PHARMACIES.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : PHARMACIES;

  return (
    <AppShell>
      <PageHeader title="Tìm nhà thuốc" subtitle="Gần vị trí của bạn" />

      <div className="space-y-4 px-4 pb-6">
        <div className="flex h-12 items-center gap-2 rounded-2xl border border-line bg-white px-3 shadow-soft focus-within:border-brand">
          <Search className="h-4 w-4 text-ink-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên nhà thuốc..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-ink-subtle"
          />
        </div>

        <div className="grid h-44 w-full place-items-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand-50 via-accent-50 to-emerald-50 text-sm text-ink-muted">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand" />
            Bản đồ nhà thuốc · 4 nhà thuốc trong 2km
          </div>
        </div>

        <div className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
          Kết quả · {filtered.length}
        </div>

        <ul className="space-y-3">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="rounded-2xl border border-line bg-white p-4 shadow-soft active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[15px] font-semibold text-ink">{p.name}</div>
                    <div className="flex items-center gap-0.5 text-xs text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      {p.rating}
                    </div>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                    <MapPin className="h-3 w-3" /> {p.address}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-pill px-2 py-0.5",
                        p.isOpen ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-ink-muted",
                      )}
                    >
                      <Clock className="h-3 w-3" /> {p.isOpen ? "Đang mở" : "Đã đóng"}
                    </span>
                    {p.hasStock && (
                      <span className="rounded-pill bg-brand-50 px-2 py-0.5 text-brand">
                        Có sẵn thuốc
                      </span>
                    )}
                    <span className="text-ink-muted">{p.distanceKm} km</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    aria-label="Chỉ đường"
                    className="grid h-9 w-9 place-items-center rounded-pill bg-brand text-white"
                  >
                    <Navigation className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Gọi"
                    className="grid h-9 w-9 place-items-center rounded-pill border border-brand text-brand"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
