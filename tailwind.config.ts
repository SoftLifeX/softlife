// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        border: "var(--border)",
        accent: "var(--accent)",
        destructive: "var(--destructive)",
        "contact-background": "var(--contact-background)",
        "contact-foreground": "var(--contact-foreground)",
        "tag-background": "var(--tag-background)",
        "tag-foreground": "var(--tag-foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
