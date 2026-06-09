import { vibrate } from "zmp-sdk";
import { usePreferences } from "@/store/usePreferences";

export type HapticType = "light" | "medium" | "heavy" | "success" | "error";

const PATTERNS: Record<HapticType, number> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: 35,
  error: 80,
};

export function haptic(type: HapticType = "light"): void {
  const enabled = usePreferences.getState().hapticsEnabled;
  if (!enabled) return;
  const duration = PATTERNS[type];
  void vibrate({ milliseconds: duration }).catch(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(duration);
    }
  });
}
