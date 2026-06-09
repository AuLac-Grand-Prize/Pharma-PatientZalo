import { beforeEach, describe, expect, it } from "vitest";
import { usePreferences } from "@/store/usePreferences";

beforeEach(() => {
  localStorage.clear();
  // Reset to the documented defaults between tests.
  usePreferences.setState({ fontScale: "default", hapticsEnabled: true });
});

describe("usePreferences", () => {
  it("defaults to fontScale 'default' and haptics enabled", () => {
    const s = usePreferences.getState();
    expect(s.fontScale).toBe("default");
    expect(s.hapticsEnabled).toBe(true);
  });

  it("cycleFontScale advances default -> large -> xlarge -> default", () => {
    const { cycleFontScale } = usePreferences.getState();

    expect(usePreferences.getState().fontScale).toBe("default");
    cycleFontScale();
    expect(usePreferences.getState().fontScale).toBe("large");
    cycleFontScale();
    expect(usePreferences.getState().fontScale).toBe("xlarge");
    cycleFontScale();
    expect(usePreferences.getState().fontScale).toBe("default");
  });

  it("setFontScale sets the value directly", () => {
    usePreferences.getState().setFontScale("large");
    expect(usePreferences.getState().fontScale).toBe("large");

    usePreferences.getState().setFontScale("xlarge");
    expect(usePreferences.getState().fontScale).toBe("xlarge");
  });

  it("toggleHaptics flips hapticsEnabled from its prior value", () => {
    expect(usePreferences.getState().hapticsEnabled).toBe(true);

    usePreferences.getState().toggleHaptics();
    expect(usePreferences.getState().hapticsEnabled).toBe(false);

    usePreferences.getState().toggleHaptics();
    expect(usePreferences.getState().hapticsEnabled).toBe(true);
  });
});
