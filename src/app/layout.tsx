import type { Metadata } from "next";
import "./globals.css";
import SmoothScroller from "@/components/smooth-scroller";
import CustomCursor from "@/components/shared/custom-cursor";
import Header from "@/components/shared/header";
import { ThemeProvider } from "next-themes";


export const metadata: Metadata = {
  title: "SoftLifeX",
  description: "",
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
          <CustomCursor/>
        <Header/>
        <SmoothScroller>
          {children}
        </SmoothScroller>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
