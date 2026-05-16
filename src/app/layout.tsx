import type { Metadata } from "next";
import "./globals.css";
import SmoothScroller from "@/components/smooth-scroller";
import CustomCursor from "@/components/shared/custom-cursor";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme-provider";
import Preloader from "@/components/shared/preloader";
import MobileExperiencePopup from "@/components/shared/mobile-experience-popup";
import GsapInit from "@/components/shared/gsap-init-client";

export const metadata: Metadata = {
  title: "SoftLifeX",
  description: "Mobile & Web Developer Portfolio — Daniel, the only one softlife.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GsapInit />
        <ThemeProvider attribute="class" disableTransitionOnChange enableSystem>
          {/* Preloader is a self-contained fixed overlay — sits on top of everything */}
          <Preloader />

          {/* Content is always rendered and visible underneath */}
          <CustomCursor />
          <Header />
          <MobileExperiencePopup />
          <SmoothScroller>
            {children}
          </SmoothScroller>
        </ThemeProvider>
      </body>
    </html>
  );
}