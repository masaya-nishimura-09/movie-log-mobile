const plugin = require("tailwindcss/plugin");

const spacing = Object.fromEntries(
  Array.from({ length: 800 }, (_, index) => {
    const step = (index + 1) * 0.25;
    return [String(step), `${step * 0.25}rem`];
  }),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: { sans: ["Poppins_400Regular"] },
      spacing,
      maxWidth: spacing,
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "foreground-sub": "var(--foreground-sub)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          edge: "var(--primary-edge)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          edge: "var(--destructive-edge)",
          border: "var(--destructive-border)",
          foreground: "var(--destructive-foreground)",
          soft: "var(--destructive-soft)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        header: "var(--header)",
        field: "var(--field)",
        control: {
          DEFAULT: "var(--control)",
          edge: "var(--control-edge)",
        },
        edge: "var(--edge)",
        "genre-chip": "var(--genre-chip)",
        "genre-selected": {
          DEFAULT: "var(--genre-selected)",
          foreground: "var(--genre-selected-foreground)",
        },
        "mood-tag": "var(--mood-tag)",
        placeholder: "var(--placeholder)",
        selected: {
          DEFAULT: "var(--selected)",
          border: "var(--selected-border)",
          foreground: "var(--selected-foreground)",
        },
        "score-high": {
          DEFAULT: "var(--score-high)",
          foreground: "var(--score-high-foreground)",
        },
        "score-low": {
          DEFAULT: "var(--score-low)",
          foreground: "var(--score-low-foreground)",
        },
        genre: {
          DEFAULT: "var(--genre)",
          foreground: "var(--genre-foreground)",
        },
        mood: {
          DEFAULT: "var(--mood)",
          foreground: "var(--mood-foreground)",
        },
        "dash-line": "var(--dash-line)",
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        sm: "7.2px",
        md: "9.6px",
        lg: "12px",
        xl: "16.8px",
        "2xl": "21.6px",
        "3xl": "26.4px",
        "4xl": "31.2px",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".font-normal": { fontFamily: "Poppins_400Regular" },
        ".font-medium": { fontFamily: "Poppins_500Medium" },
        ".font-semibold": { fontFamily: "Poppins_700Bold" },
        ".font-bold": { fontFamily: "Poppins_700Bold" },
      });
    }),
  ],
};
