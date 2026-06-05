import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FontScale = "default" | "large" | "xlarge";

interface PreferencesState {
  fontScale: FontScale;
  hapticsEnabled: boolean;
  setFontScale: (scale: FontScale) => void;
  cycleFontScale: () => void;
  toggleHaptics: () => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      fontScale: "default",
      hapticsEnabled: true,
      setFontScale: (fontScale) => set({ fontScale }),
      cycleFontScale: () => {
        const order: FontScale[] = ["default", "large", "xlarge"];
        const current = get().fontScale;
        const next = order[(order.indexOf(current) + 1) % order.length];
        set({ fontScale: next ?? "default" });
      },
      toggleHaptics: () => set({ hapticsEnabled: !get().hapticsEnabled }),
    }),
    {
      name: "pharmalink.prefs",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

const SCALE_TO_PX: Record<FontScale, string> = {
  default: "15px",
  large: "17px",
  xlarge: "20px",
};

export function FontScaleApplier() {
  const fontScale = usePreferences((s) => s.fontScale);
  useEffect(() => {
    document.documentElement.style.setProperty("--app-font-size", SCALE_TO_PX[fontScale]);
    document.documentElement.dataset.fontScale = fontScale;
  }, [fontScale]);
  return null;
}
