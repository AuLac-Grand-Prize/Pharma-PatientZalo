/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
          light: "#60A5FA",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
        },
        accent: {
          DEFAULT: "#06B6D4",
          50: "#ECFEFF",
          100: "#CFFAFE",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          muted: "#666666",
          subtle: "#94A3B8",
        },
        line: "#E2E8F0",
        surface: "#F8FAFC",
        success: "#10B981",
        warn: "#F59E0B",
        danger: "#EF4444",
      },
      borderRadius: {
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
        tabbar: "0 -4px 16px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
