import { Home, MessageCircle, ScanLine, Search, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { haptic } from "@/lib/haptics";

interface Tab {
  to: string;
  label: string;
  icon: typeof Home;
}

const TABS: Tab[] = [
  { to: "/", label: "HOME", icon: Home },
  { to: "/drug-search", label: "SEARCH", icon: Search },
  { to: "/prescription-scan", label: "SCAN", icon: ScanLine },
  { to: "/ai-chat", label: "CHAT", icon: MessageCircle },
  { to: "/profile", label: "PROFILE", icon: User },
];

export function TabBar() {
  const { pathname } = useLocation();
  const nav = useNavigate();

  return (
    <nav className="safe-bottom bg-white px-5 pt-3">
      <div className="flex h-[54px] items-center justify-between rounded-pill border border-line bg-white p-1 shadow-tabbar">
        {TABS.map((t) => {
          const active = pathname === t.to;
          const Icon = t.icon;
          return (
            <button
              key={t.to}
              onClick={() => {
                if (!active) haptic("light");
                nav(t.to);
              }}
              aria-label={t.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-full flex-1 flex-col items-center justify-center gap-0.5 rounded-pill text-[10px] font-medium tracking-wider transition-colors",
                active ? "bg-brand text-white" : "text-ink-subtle",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
