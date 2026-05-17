import type { MetadataRoute } from "next";

const siteURL = "https://softlifex.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        // Disallow any Next.js internals if they ever surface as routes
        disallow:  ["/_next/", "/api/"],
      },
    ],
    sitemap:    `${siteURL}/sitemap.xml`,
    host:       siteURL,
  };
}