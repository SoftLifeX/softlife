import type { Metadata } from "next";
import "./globals.css";
import SmoothScroller from "@/components/smooth-scroller";
import CustomCursor from "@/components/shared/custom-cursor";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme-provider";
import PreloaderWrapper from "@/components/shared/preloader-wrapper";
import MobileExperiencePopup from "@/components/shared/mobile-experience-popup";

export const metadata: Metadata = {
  title: "SoftLifeX",
  description: "Mobile & Web Developer Portfolio — Daniel, the only one softlife.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          enableSystem
        >
          <PreloaderWrapper>
            <CustomCursor />
            <Header />
            <MobileExperiencePopup />
            <SmoothScroller>
              {children}
            </SmoothScroller>
          </PreloaderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}