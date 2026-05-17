import type { MetadataRoute } from "next";

const siteURL = "https://softlifex.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:              siteURL,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         1,
    },
  ];
}