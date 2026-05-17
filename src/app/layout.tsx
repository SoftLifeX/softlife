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
const HANDLE    = "@softlifex";
const DESC =
  "Full-stack & mobile software engineer crafting high-quality digital and " +
  "immersive experiences. 4 years building with React, Next.js, React Native " +
  "and Flutter — based in Lagos, Nigeria.";

export const metadata: Metadata = {
  // Title template — child pages append " | SoftLifeX" automatically
  title: {
    default:  `${siteName} — Full-Stack & Mobile Engineer`,
    template: `%s | ${siteName}`,
  },

  description: DESC,

  // metadataBase makes all relative URLs absolute for OG/Twitter/canonical.
  // Also tells Google the canonical domain, preventing the *.vercel.app
  // mirror (which Vercel generates) from being indexed as a duplicate.
  metadataBase: new URL(siteURL),
  alternates: {
    canonical: "/",
  },

  // Keywords — tight and realistic (Google soft-ignores stuffed lists)
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

  // Crawling
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

  // Open Graph — Next.js auto-serves app/opengraph-image.png, but declaring
  // dimensions explicitly ensures LinkedIn/Slack/WhatsApp pick it up correctly
  openGraph: {
    type:        "website",
    locale:      "en_NG",
    url:         siteURL,
    siteName:    siteName,
    title:       `${siteName} — Full-Stack & Mobile Engineer`,
    description: DESC,
    images: [
      {
        url:    "/opengraph-image.png",
        width:  1200,
        height: 630,
        alt:    `${siteName} — Full-Stack & Mobile Engineer`,
      },
    ],
  },

  // Twitter / X card
  twitter: {
    card:        "summary_large_image",
    title:       `${siteName} — Full-Stack & Mobile Engineer`,
    description: DESC,
    creator:     HANDLE,
    images:      ["/opengraph-image.png"],
  },

  // Uncomment and add your token once you connect Google Search Console:
  // verification: {
  //   google: "YOUR_VERIFICATION_TOKEN",
  // },
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