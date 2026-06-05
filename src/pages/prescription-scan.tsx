import { useState } from "react";
import { Camera, CheckCircle2, Image as ImageIcon, Loader2, RefreshCw, ScanLine, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/cn";

interface OcrLine {
  drug: string;
  dosage: string;
  schedule: string;
}

const RESULT: OcrLine[] = [
  { drug: "Amoxicillin 500mg", dosage: "21 viên", schedule: "1 viên × 3 lần/ngày × 7 ngày" },
  { drug: "Paracetamol 500mg", dosage: "10 viên", schedule: "Khi sốt > 38.5°C" },
  { drug: "Loratadin 10mg", dosage: "7 viên", schedule: "1 viên buổi tối" },
];

type Stage = "idle" | "scanning" | "review";

export default function PrescriptionScanPage() {
  const [stage, setStage] = useState<Stage>("idle");

  async function start() {
    setStage("scanning");
    await new Promise((r) => setTimeout(r, 1300));
    setStage("review");
  }

  return (
    <AppShell>
      <PageHeader title="Quét đơn thuốc" subtitle="OCR đơn thuốc viết tay" />

      <div className="space-y-5 px-4 pb-6">
        <div
          className={cn(
            "relative flex aspect-[3/4] flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-line bg-white",
            stage === "scanning" && "border-brand bg-brand-50/40",
          )}
        >
          {stage === "idle" && (
            <>
              <div className="grid h-16 w-16 place-items-center rounded-pill bg-brand-100 text-brand">
                <ScanLine className="h-8 w-8" />
              </div>
              <p className="mt-4 px-6 text-center text-sm text-ink-muted">
                Đặt đơn thuốc vào khung và đảm bảo ảnh rõ nét.
              </p>
            </>
          )}

          {stage === "scanning" && (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-brand" />
              <p className="mt-3 text-sm font-medium text-ink">Đang đọc đơn thuốc...</p>
            </>
          )}

          {stage === "review" && (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50 text-sm text-ink-muted">
              [Preview ảnh đơn thuốc]
            </div>
          )}

          <div className="pointer-events-none absolute inset-6 rounded-2xl border border-brand/30" />
        </div>

        {stage !== "review" ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={start}
              className="flex h-12 items-center justify-center gap-2 rounded-pill bg-brand font-medium text-white active:scale-[0.98]"
            >
              <Camera className="h-4 w-4" /> Chụp ảnh
            </button>
            <button
              onClick={start}
              className="flex h-12 items-center justify-center gap-2 rounded-pill border border-brand bg-white font-medium text-brand active:scale-[0.98]"
            >
              <ImageIcon className="h-4 w-4" /> Tải lên
            </button>
          </div>
        ) : (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Đọc thành công
                </div>
                <div className="text-xs text-ink-muted">Trích xuất {RESULT.length} thuốc</div>
              </div>
              <button
                onClick={() => setStage("idle")}
                aria-label="Quét lại"
                className="grid h-9 w-9 place-items-center rounded-pill bg-surface text-ink-muted"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            <ul className="space-y-2">
              {RESULT.map((line) => (
                <li
                  key={line.drug}
                  className="rounded-2xl border border-line bg-white p-4 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-ink">{line.drug}</div>
                    <span className="rounded-pill bg-surface px-2 py-0.5 text-xs text-ink-muted">
                      {line.dosage}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-ink-muted">{line.schedule}</div>
                </li>
              ))}
            </ul>

            <button className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-brand font-medium text-white active:scale-[0.98]">
              <ShoppingBag className="h-4 w-4" /> Đặt thuốc tại nhà thuốc gần
            </button>
          </section>
        )}
      </div>
    </AppShell>
  );
}
