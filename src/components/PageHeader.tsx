import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, right, onBack }: PageHeaderProps) {
  const nav = useNavigate();
  return (
    <header className="flex items-center gap-3 bg-white px-4 py-3">
      <button
        type="button"
        aria-label="Quay lại"
        onClick={onBack ?? (() => nav(-1))}
        className="grid h-9 w-9 place-items-center rounded-pill bg-surface text-ink-muted active:scale-95"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div className="flex-1">
        <div className="text-[15px] font-semibold text-ink">{title}</div>
        {subtitle && <div className="text-xs text-ink-muted">{subtitle}</div>}
      </div>
      {right}
    </header>
  );
}
