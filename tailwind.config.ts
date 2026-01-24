import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        destructive: "hsl(var(--destructive))",
        "contact-background": "hsl(var(--contact-background))",
        "contact-foreground": "hsl(var(--contact-foreground))",
      },
    },
  },
  plugins: [],
};

export default config;
