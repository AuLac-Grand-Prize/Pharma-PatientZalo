import type { ReactNode } from "react";
import { StatusBar } from "./StatusBar";
import { TabBar } from "./TabBar";

interface AppShellProps {
  children: ReactNode;
  hideTabBar?: boolean;
}

export function AppShell({ children, hideTabBar = false }: AppShellProps) {
  return (
    <div className="zalo-screen">
      <StatusBar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      {!hideTabBar && <TabBar />}
    </div>
  );
}
