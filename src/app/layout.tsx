import type { Metadata } from "next";
import "./globals.css";
import SmoothScroller from "@/components/smooth-scroller";
import CustomCursor from "@/components/shared/custom-cursor";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme-provider";
import Preloader from "@/components/shared/preloader";
import GsapInit from "@/components/shared/gsap-init-client";
import PageTransition from "@/components/shared/page-transition";


const SITE_URL  = "https://softlifex.vercel.app";
const SITE_NAME = "Daniel C Daniel | SoftLifeX";
const FULL_NAME = "Daniel Chimbu-Okaaomee Daniel";
const HANDLE    = "@softlifex";
const DESC =
  "Full-stack & mobile software engineer crafting high-quality digital and " +
  "immersive experiences. 4 years building with React, Next.js, React Native " +
  "and Flutter | based in Lagos, Nigeria.";


export const metadata: Metadata = {
  title: {
    default:  `${SITE_NAME} ~ Full-Stack & Mobile Engineer`,
    template: `%s | ${SITE_NAME}`,
  },

  description: DESC,

  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },

  keywords: [
    "SoftLifeX",
    "Daniel Chimbu-Okaaomee Daniel",
    "Daniel C Daniel",
    "frontend developer Nigeria",
    "React Native developer Lagos",
    "mobile app developer Nigeria",
    "full stack developer portfolio",
    "Next.js developer Nigeria",
    "Flutter developer Nigeria",
    "immersive web experiences",
    "motion design developer",
  ],

  authors:   [{ name: FULL_NAME, url: SITE_URL }],
  creator:   FULL_NAME,
  publisher: SITE_NAME,

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

  openGraph: {
    type:        "website",
    locale:      "en_NG",
    url:         SITE_URL,
    siteName:    SITE_NAME,
    title:       `${SITE_NAME} | Full-Stack & Mobile Engineer`,
    description: DESC,
    images: [
      {
        url:    "/opengraph-image.png",
        width:  1200,
        height: 630,
        alt:    `${SITE_NAME} | Full-Stack & Mobile Engineer`,
      },
    ],
  },

  // Twitter / X card
  twitter: {
    card:        "summary_large_image",
    title:       `${SITE_NAME} | Full-Stack & Mobile Engineer`,
    description: DESC,
    creator:     HANDLE,
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
          <PageTransition>
              {children}
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}