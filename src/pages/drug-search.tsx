import { useMemo, useState } from "react";
import { ChevronRight, FileText, Filter, Pill, Search, Sparkles, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import type { DrugSearchResult } from "@/types";

const POPULAR = ["Paracetamol", "Amoxicillin", "Vitamin C", "Ibuprofen", "Loratadin"];

const RESULTS: DrugSearchResult[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    inn: "Paracetamol",
    description: "Giảm đau, hạ sốt thông thường cho người lớn và trẻ em",
    prescriptionRequired: false,
    uses: ["Hạ sốt", "Đau đầu", "Đau cơ"],
  },
  {
    id: "2",
    name: "Amoxicillin 500mg",
    inn: "Amoxicillin",
    description: "Kháng sinh nhóm beta-lactam điều trị nhiễm khuẩn đường hô hấp",
    prescriptionRequired: true,
    uses: ["Viêm họng", "Viêm phế quản"],
  },
  {
    id: "3",
    name: "Loratadin 10mg",
    inn: "Loratadin",
    description: "Thuốc chống dị ứng thế hệ 2, không gây buồn ngủ",
    prescriptionRequired: false,
    uses: ["Viêm mũi dị ứng", "Mày đay"],
  },
];

export default function DrugSearchPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      query
        ? RESULTS.filter(
            (r) =>
              r.name.toLowerCase().includes(query.toLowerCase()) ||
              r.inn.toLowerCase().includes(query.toLowerCase()),
          )
        : RESULTS,
    [query],
  );

  return (
    <AppShell>
      <PageHeader title="Tra cứu thuốc" subtitle="2,000+ hoạt chất Việt Nam" />

      <div className="space-y-5 px-4 pb-6">
        <div className="flex h-12 items-center gap-2 rounded-2xl border border-line bg-white px-3 shadow-soft focus-within:border-brand">
          <Search className="h-4 w-4 text-ink-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập tên thuốc hoặc hoạt chất..."
            className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-ink-subtle"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              aria-label="Xóa"
              className="grid h-7 w-7 place-items-center rounded-pill text-ink-subtle hover:bg-surface"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button aria-label="Lọc" className="grid h-7 w-7 place-items-center rounded-pill text-ink-subtle">
              <Filter className="h-4 w-4" />
            </button>
          )}
        </div>

        {!query && (
          <section>
            <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ink-subtle">
              <Sparkles className="h-3 w-3" /> Tìm kiếm phổ biến
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => setQuery(p)}
                  className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs text-ink-muted active:bg-surface"
                >
                  {p}
                </button>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
            {query ? `Kết quả · ${filtered.length}` : "Có thể bạn quan tâm"}
          </div>
          <ul className="mt-2 space-y-3">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-line bg-white p-4 shadow-soft active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-[15px] font-semibold text-ink">{r.name}</div>
                      {r.prescriptionRequired && (
                        <span className="rounded-pill bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          Cần đơn
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-ink-muted">{r.inn}</div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{r.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.uses.map((u) => (
                        <span
                          key={u}
                          className="rounded-pill bg-surface px-2 py-0.5 text-[10px] text-ink-muted"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-ink-subtle" />
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-sm text-ink-muted">
                <FileText className="mx-auto h-6 w-6 text-ink-subtle" />
                <div className="mt-2">Không tìm thấy thuốc nào.</div>
              </li>
            )}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
