import type { Metadata } from "next";
import GivtroPage from "@/components/work/givtro";

export const metadata: Metadata = {
  title: "Givtro — Nigerian Fintech App",
  description:
    "Case study: Givtro — a full-stack Nigerian fintech platform built solo by Daniel Chimbu-Okaaomee Daniel. " +
    "P2P transfers, bank transfers, VTU services, gift cards, biometric auth, and KYC — React Native frontend, Node.js/Express backend.",
  alternates: { canonical: "/work/givtro" },
  openGraph: {
    title: "Givtro — Nigerian Fintech App | SoftLifeX",
    description:
      "Full-stack fintech platform — React Native, Node.js/Express, MongoDB. " +
      "P2P transfers, bank transfers, VTU, gift cards, biometric auth, KYC. Built solo.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
};

export default function Givtro() {
  return <GivtroPage />;
}