"use client";

import { ThemeProvider } from "next-themes";
import CustomCursor from "@/components/shared/custom-cursor";
import Header from "@/components/shared/header";
import SmoothScroller from "@/components/smooth-scroller";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CustomCursor />
      <Header />
      <SmoothScroller>{children}</SmoothScroller>
    </ThemeProvider>
  );
}
