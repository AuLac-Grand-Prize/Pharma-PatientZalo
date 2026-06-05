interface StatusBarProps {
  time?: string;
}

export function StatusBar({ time = "9:41" }: StatusBarProps) {
  return (
    <div className="safe-top flex h-[44px] items-center justify-center bg-white px-5 text-[15px] font-semibold text-ink">
      {time}
    </div>
  );
}
