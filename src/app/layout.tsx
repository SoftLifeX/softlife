import type { Metadata } from "next";
import "./globals.css";
import SmoothScroller from "@/components/smooth-scroller";
import CustomCursor from "@/components/shared/custom-cursor";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme-provider";
import Preloader from "@/components/shared/preloader";
import MobileExperiencePopup from "@/components/shared/mobile-experience-popup";
import GsapInit from "@/components/shared/gsap-init-client";


const siteURL  = "https://softlifex.vercel.app";
const siteName = "SoftLifeX";
const fullName = "Daniel Chimbu-Okaaomee Daniel";
const handle    = "@softlifex";
const desc =
  "Full-stack & mobile software engineer crafting high-quality digital and " +
  "immersive experiences. 4 years building with React, Next.js, React Native " +
  "and Flutter — based in Lagos, Nigeria.";

export const metadata: Metadata = {
  title: {
    default:  `${siteName} — Full-Stack & Mobile Engineer`,
    template: `%s | ${siteName}`,
  },

  description: desc,
  metadataBase: new URL(siteURL),
  alternates: {
    canonical: "/",
  },

  keywords: [
    "SoftLifeX",
    "Daniel Chimbu-Okaaomee Daniel",
    "frontend developer Nigeria",
    "React Native developer Lagos",
    "mobile app developer Nigeria",
    "full stack developer portfolio",
    "Next.js developer Nigeria",
    "Flutter developer Nigeria",
    "immersive web experiences",
    "motion design developer",
  ],

  authors:   [{ name: fullName, url: siteURL }],
  creator:   fullName,
  publisher: siteName,

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:                true,
      follow:               true,
      "max-video-preview":  -1,
      "max-image-preview":  "large",
      "max-snippet":        -1,
    },
  },

  openGraph: {
    type:        "website",
    locale:      "en_NG",
    url:         siteURL,
    siteName:    siteName,
    title:       `${siteName} — Full-Stack & Mobile Engineer`,
    description: desc,
    images: [
      {
        url:    "/opengraph-image.png",
        width:  1200,
        height: 630,
        alt:    `${siteName} — Full-Stack & Mobile Engineer`,
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       `${siteName} — Full-Stack & Mobile Engineer`,
    description: desc,
    creator:     handle,
    images:      ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GsapInit />
        <ThemeProvider attribute="class" disableTransitionOnChange enableSystem>
          <Preloader />
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