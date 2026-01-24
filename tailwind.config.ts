// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
       transitionTimingFunction: {
        "ease-custom": "cubic-bezier(0.25, 0.46, 0.45, 0.94)", 
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      
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
