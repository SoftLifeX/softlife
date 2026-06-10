"use client";

import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-init";
import { SplitText } from "gsap/SplitText";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";
import mockup from "@/app/assets/projects/givtro/givtro_mockup.webp";
import g1 from "@/app/assets/projects/givtro/givtro_1.webp";
import g2 from "@/app/assets/projects/givtro/givtro_2.webp";
import g3 from "@/app/assets/projects/givtro/givtro_3.webp";
import g4 from "@/app/assets/projects/givtro/givtro_4.webp";
import g5 from "@/app/assets/projects/givtro/givtro_5.webp";
import g6 from "@/app/assets/projects/givtro/givtro_6.webp";
import g7 from "@/app/assets/projects/givtro/givtro_7.webp";
import g8 from "@/app/assets/projects/givtro/givtro_8.webp";
import g9 from "@/app/assets/projects/givtro/givtro_9.webp";
import g10 from "@/app/assets/projects/givtro/givtro_10.webp";
import g11 from "@/app/assets/projects/givtro/givtro_11.webp";
import g12 from "@/app/assets/projects/givtro/givtro_12.webp";
import g13 from "@/app/assets/projects/givtro/givtro_13.webp";
import g14 from "@/app/assets/projects/givtro/givtro_14.webp";
import g15 from "@/app/assets/projects/givtro/givtro_15.webp";
import g16 from "@/app/assets/projects/givtro/givtro_16.webp";
import g17 from "@/app/assets/projects/givtro/givtro_17.webp";
import g18 from "@/app/assets/projects/givtro/givtro_18.webp";
import g19 from "@/app/assets/projects/givtro/givtro_19.webp";
import g20 from "@/app/assets/projects/givtro/givtro_20.webp";
import FeatureCard from "@/components/ui/featureCard"

const BRAND = "#2466F2";
const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

const stack = {
    mobile: ["React Native", "Expo", "TypeScript", "Zustand", "React Query"],
    backend: ["Node.js", "Express", "TypeScript", "MongoDB", "JWT"],
    services: ["Reloadly", "N-Verify", "Cloudinary"],
};

const features = [
    { number: "01", title: "Wallet & Transfers", body: "Full wallet infrastructure — fund, hold, and move money. Givtro-to-Givtro P2P transfers resolve instantly. Live third-party bank transfers route through verified account lookup before dispatch." },
    { number: "02", title: "VTU Services", body: "Airtime top-up, electricity tokens, cable TV subscriptions, and sports betting wallet funding — all through a unified bill-payment layer with real-time confirmation and receipt generation." },
    { number: "03", title: "Gift Cards", body: "International gift card purchase and redemption via Reloadly. Covers major global brands with denomination selection, in-app delivery, and full transaction history." },
    { number: "04", title: "Biometric Auth", body: "Device-level biometric authentication — fingerprint and Face ID via expo-local-authentication. Secure token refresh, PIN fallback, and auto-lock on inactivity." },
    { number: "05", title: "KYC Verification", body: "Identity verification via N-Verify — BVN and NIN validation gating full account access. Tiered account limits enforced until verification clears." },
    { number: "06", title: "Transaction System", body: "Every money movement runs through a state machine — pending, processing, success, failed — with exhaustive error handling, retry logic, and a receipt screen for every terminal state." },
    { number: "07", title: "Agent Flow", body: "Dedicated agent dashboard for cash-in/cash-out. Agents operate under elevated limits with a distinct transaction ledger separated from consumer flows." },
    { number: "08", title: "Profile & Security", body: "Profile picture uploads via Cloudinary with in-app cropping. Security centre: active sessions, PIN change, biometric toggle, transaction PIN — all behind re-authentication." },
];

const screens: { src: StaticImageData; alt: string }[] = [
    { src: g1, alt: "Givtro home dashboard" },
    { src: g2, alt: "P2P transfer" },
    { src: g3, alt: "Bank transfer" },
    { src: g4, alt: "Transaction confirmation" },
    { src: g5, alt: "Transaction receipt" },
    { src: g6, alt: "Airtime top-up" },
    { src: g7, alt: "Electricity token" },
    { src: g8, alt: "Cable TV subscription" },
    { src: g9, alt: "Betting wallet funding" },
    { src: g10, alt: "Gift card catalogue" },
    { src: g11, alt: "Gift card denomination" },
    { src: g12, alt: "Biometric auth setup" },
    { src: g13, alt: "KYC verification" },
    { src: g14, alt: "Wallet funding" },
    { src: g15, alt: "Transaction history" },
    { src: g16, alt: "Agent dashboard" },
    { src: g17, alt: "Profile settings" },
    { src: g18, alt: "Security centre" },
    { src: g19, alt: "Onboarding flow" },
    { src: g20, alt: "Dark mode interface" },
];

const CARD_TRANSFORMS: [number[], number[]][] = [
    [[10, 50, -10, 10], [20, -10, -45, 10]],
    [[0, 47.5, -10, 15], [-25, 15, -45, 30]],
    [[0, 52.5, -10, 5], [15, -5, -40, 60]],
    [[10, 50, -10, 10], [20, -10, -45, 90]],
    [[0, 55, -15, 30], [25, -15, 60, 120]],
    [[5, 48, -12, 8], [10, -8, -42, 20]],
    [[0, 53, -8, 20], [-15, 10, -38, 50]],
    [[8, 51, -14, 12], [18, -12, -44, 70]],
    [[0, 49, -10, 18], [-20, 12, -40, 40]],
    [[6, 54, -12, 25], [22, -14, -46, 80]],
    [[0, 52, -8, 6], [12, -6, -38, 55]],
    [[10, 50, -15, 14], [-10, 8, -42, 65]],
    [[0, 55, -10, 22], [16, -10, -44, 95]],
    [[5, 48, -12, 10], [-18, 14, -40, 35]],
    [[0, 51, -8, 28], [24, -16, -46, 105]],
    [[8, 53, -14, 16], [-12, 6, -38, 45]],
    [[0, 49, -10, 8], [14, -8, -42, 75]],
    [[6, 52, -12, 20], [-22, 10, -44, 85]],
    [[10, 50, -15, 12], [20, -12, -46, 15]],
    [[0, 54, -8, 24], [-16, 16, -40, 100]],
];

function GivtroLogo({ size = 32 }: { size?: number }) {
    return (
        <svg width={size} height={Math.round((39 / 46) * size)} viewBox="0 0 46 39" fill="none" aria-label="Givtro logo">
            <path fillRule="evenodd" clipRule="evenodd" d="M32.118 29H18.853a2.964 2.964 0 01-2.327-1.072L10.03 20.31a.124.124 0 01.002-.164.124.124 0 01.162-.021l6.586 4.355c.523.346 1.061.507 1.688.507h12.26a.122.122 0 00.102-.053l.965-1.373a.122.122 0 00.01-.13.123.123 0 00-.112-.067h-7.331c-.69 0-1.255-.562-1.255-1.252v-2.625h9.011a3.059 3.059 0 013.055 3.05v3.415c0 1.679-1.373 3.05-3.055 3.05V29z" fill={BRAND} />
            <path fillRule="evenodd" clipRule="evenodd" d="M13.085 10H26.35c.927 0 1.726.368 2.327 1.073l6.496 7.618c.04.048.04.117-.002.164a.124.124 0 01-.162.021l-7.354-4.862h-13.18a.121.121 0 00-.102.053l-.965 1.373a.122.122 0 00-.01.13.123.123 0 00.112.067h7.331c.69 0 1.255.562 1.255 1.252v2.625h-9.011a3.058 3.058 0 01-3.055-3.05V13.05c0-1.679 1.372-3.049 3.055-3.049z" fill="#3A4657" />
        </svg>
    );
}

function Pill({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-primary-foreground">
            {label}
        </span>
    );
}

interface WipeLabelProps {
    blockRef: React.RefObject<HTMLDivElement | null>;
    widthRef: React.RefObject<HTMLDivElement | null>;
    textRef: React.RefObject<HTMLParagraphElement | null>;
    label: string;
}

function WipeLabel({ blockRef, widthRef, textRef, label }: WipeLabelProps) {
    return (
        <div className="relative w-fit">
            <div className="relative w-fit group">
                <p ref={textRef} className="opacity-0 relative text-sm text-foreground">{label}</p>
                <div ref={widthRef} className="absolute left-0 bottom-0 h-px w-full bg-foreground origin-left transition-transform duration-500 ease-(--ease-custom) group-hover:origin-right group-hover:scale-x-0" />
            </div>
            <div ref={blockRef} className="absolute w-0 h-full top-0 left-0 pointer-events-none bg-foreground" />
        </div>
    );
}

export default function GivtroPage() {
    const pageRef = useRef<HTMLElement>(null);

    const ready = usePageReady();

    const overviewBlockRef = useRef<HTMLDivElement>(null);
    const overviewWidthRef = useRef<HTMLDivElement>(null);
    const overviewTextRef = useRef<HTMLParagraphElement>(null);

    const featuresBlockRef = useRef<HTMLDivElement>(null);
    const featuresWidthRef = useRef<HTMLDivElement>(null);
    const featuresTextRef = useRef<HTMLParagraphElement>(null);

    const engBlockRef = useRef<HTMLDivElement>(null);
    const engWidthRef = useRef<HTMLDivElement>(null);
    const engTextRef = useRef<HTMLParagraphElement>(null);

    const screensBlockRef = useRef<HTMLDivElement>(null);
    const screensWidthRef = useRef<HTMLDivElement>(null);
    const screensTextRef = useRef<HTMLParagraphElement>(null);

    const mobileLineRef = useRef<HTMLDivElement>(null);
    const backendLineRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!ready) return;

            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

            if (reduced) {
                gsap.set(
                    ".g-title, .g-meta, .g-overview-heading, .g-overview-body, .g-pill, .g-feature, .g-eng-item",
                    { opacity: 1, y: 0, x: 0 }
                );
                gsap.set([mobileLineRef.current, backendLineRef.current], { scaleX: 1 });
                return;
            }

            const ctx = gsap.context(() => {

                document.fonts.ready.then(() => {
                    // Defer one rAF so the page has fully painted after navigation
                    // before SplitText measures and ScrollTrigger calculates positions
                    requestAnimationFrame(() => {

                        // Title — char wipe in from right
                        const titleSplit = new SplitText(".g-title", { type: "chars, words", mask: "chars" });
                        gsap.set(titleSplit.chars, { xPercent: 100, opacity: 0 });
                        gsap.to(titleSplit.chars, {
                            xPercent: 0, opacity: 1, stagger: 0.04, duration: 0.7, ease, delay: 0.1,
                        });

                        // Overview heading — word scrub
                        const overviewSplit = new SplitText(".g-overview-heading", { type: "words, lines" });
                        gsap.set(overviewSplit.words, { opacity: 0, y: 20 });
                        gsap.to(overviewSplit.words, {
                            opacity: 1, y: 0, ease, stagger: 0.02,
                            scrollTrigger: {
                                trigger: ".g-overview-heading",
                                start: "top 80%", end: "top 55%", scrub: true,
                            },
                        });

                        // Overview body — word scrub
                        const bodySplit = new SplitText(".g-overview-body", { type: "words, lines" });
                        gsap.set(bodySplit.words, { opacity: 0, y: 20 });
                        gsap.to(bodySplit.words, {
                            opacity: 1, y: 0, ease, stagger: 0.015,
                            scrollTrigger: {
                                trigger: ".g-overview-body",
                                start: "top 85%", end: "top 60%", scrub: true,
                            },
                        });

                        ctx.add(() => () => {
                            titleSplit.revert();
                            overviewSplit.revert();
                            bodySplit.revert();
                        });

                        ScrollTrigger.refresh();
                    });
                });

                // Meta rows — fade up on load
                gsap.set(".g-meta", { y: 16, opacity: 0 });
                gsap.to(".g-meta", {
                    y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease, delay: 0.4,
                });

                // Pills — exact Skills section pattern
                const pills = gsap.utils.toArray<HTMLElement>(".g-pill");
                gsap.set(pills, { scale: 0.88, opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" });
                gsap.to(pills, {
                    scale: 1, opacity: 1, duration: 0.28, ease: "power3.out", stagger: 0.07,
                    scrollTrigger: {
                        trigger: pills[0]?.parentElement,
                        start: "top 80%", end: "top 60%", scrub: true,
                    },
                    onComplete: () => { gsap.set(pills, { willChange: "auto" }); },
                });

                // Section label wipes
                [
                    { block: overviewBlockRef, width: overviewWidthRef, text: overviewTextRef },
                    { block: featuresBlockRef, width: featuresWidthRef, text: featuresTextRef },
                    { block: engBlockRef, width: engWidthRef, text: engTextRef },
                    { block: screensBlockRef, width: screensWidthRef, text: screensTextRef },
                ].forEach(({ block, width, text }) => {
                    registerWipe(
                        { blockRef: block, widthRef: width, textRef: text },
                        { trigger: () => text.current, direction: "left", startOffset: "top 90%", ease }
                    );
                });

                // Feature cards
                gsap.set(".g-feature", { y: 32, opacity: 0 });
                gsap.to(".g-feature", {
                    y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease,
                    scrollTrigger: { trigger: ".g-features-grid", start: "top 80%", toggleActions: "play none none none" },
                });

                // Engineering divider lines — scaleX scrub, same as Skills underlines
                [mobileLineRef, backendLineRef].forEach((lineRef) => {
                    gsap.from(lineRef.current, {
                        scaleX: 0,
                        transformOrigin: "left center",
                        ease,
                        scrollTrigger: {
                            trigger: lineRef.current,
                            start: "top 80%", end: "top 60%", scrub: true,
                        },
                    });
                });

                // Engineering list items
                gsap.set(".g-eng-item", { x: -20, opacity: 0 });
                gsap.to(".g-eng-item", {
                    x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease,
                    scrollTrigger: { trigger: ".g-eng-grid", start: "top 75%", toggleActions: "play none none none" },
                });

                // Screens — scroll-driven card sweep
                // Cards start off-right, sweep through the viewport with y+rotation arcs,
                // then exit off-left. Staggered delays keep 3-4 cards visible at once.
                const screensSection = pageRef.current?.querySelector<HTMLElement>(".g-screens-section");
                const screenCards = pageRef.current?.querySelectorAll<HTMLElement>(".g-screen-card");

                if (screensSection && screenCards?.length) {
                    const isMobile = window.innerWidth < 768;
                    const stickyHeight = window.innerHeight * (isMobile ? 4 : 6);
                    const vw = window.innerWidth;

                    // Use absolute pixel x values so travel distance is viewport-relative,
                    // not relative to the card's own width (which xPercent would be).
                    // startX: just off the right edge. endX: fully off the left edge.
                    const startX = vw + 20;
                    const endX = -(vw + 200);

                    gsap.set(screenCards, { opacity: 0, x: startX });

                    ScrollTrigger.create({
                        trigger: screensSection,
                        start: "top top",
                        end: `+=${stickyHeight}px`,
                        pin: true,
                        pinSpacing: true,
                        onUpdate: (self) => {
                            const progress = self.progress;

                            screenCards.forEach((card, index) => {
                                const delay = index * (isMobile ? 0.04 : 0.065);
                                const cardProgress = Math.max(0, Math.min((progress - delay) * 2, 1));

                                if (cardProgress > 0) {
                                    const yPos = CARD_TRANSFORMS[index]?.[0] ?? [0, 0, 0, 0];
                                    const rotations = CARD_TRANSFORMS[index]?.[1] ?? [0, 0, 0, 0];

                                    // Pixel-based x: sweeps from right edge to left edge
                                    const cardX = gsap.utils.interpolate(startX, endX, cardProgress);

                                    const yProgress = cardProgress * 3;
                                    const yIndex = Math.min(Math.floor(yProgress), yPos.length - 2);
                                    const yLerp = yProgress - yIndex;

                                    // y stays as percent of card height — that's intentional arc movement
                                    const cardY = gsap.utils.interpolate(yPos[yIndex], yPos[yIndex + 1] ?? yPos[yIndex], yLerp);
                                    const cardRotation = gsap.utils.interpolate(rotations[yIndex], rotations[yIndex + 1] ?? rotations[yIndex], yLerp);

                                    gsap.set(card, { x: cardX, yPercent: cardY, rotation: cardRotation, opacity: 1 });
                                } else {
                                    gsap.set(card, { opacity: 0 });
                                }
                            });
                        },
                    });
                }

            }, pageRef);

            return () => ctx.revert();
        },
        { scope: pageRef, dependencies: [ready] }
    );

    return (
        <main ref={pageRef} className="min-h-screen bg-primary text-foreground">

            {/* Back */}
            <div className="px py pt-8">
                <Link href="/#craft" className="link group inline-flex items-center gap-2 text-sm text-primary-foreground">
                    <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                    <span>All work</span>
                </Link>
            </div>

            {/* Hero */}
            <section className="px py">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div>
                        <div className="g-meta flex items-center gap-3 mb-6">
                            <GivtroLogo size={36} />
                            <span className="text-sm text-primary-foreground">Naelix Technologies</span>
                        </div>
                        <h1 className="g-title text-4xl md:text-8xl font-bold leading-tight text-foreground mb-4">
                            Givtro
                        </h1>
                        <p className="g-meta text-sm text-primary-foreground max-w-md">
                            A full-featured Nigerian fintech platform — mobile-first, built solo across the entire stack.
                        </p>
                    </div>
                    <div className="g-meta flex flex-col gap-2 text-sm md:items-end">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: BRAND }} />
                            <span className="text-primary-foreground">Coming Soon</span>
                        </div>
                        <span className="text-primary-foreground">2024 — 2025</span>
                        <span className="text-primary-foreground">Solo Engineer — Full-Stack</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
                    <div className="g-gallery-item relative w-full overflow-hidden rounded-2xl bg-foreground/5" style={{ aspectRatio: "9/10" }}>
                        <Image src={mockup} alt="Givtro" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </div>

                    <div className="g-pills flex flex-wrap gap-2 content-start">
                        {[...stack.mobile, ...stack.backend, ...stack.services].map((s, i) => (
                            <span key={`${s}-${i}`} className="g-pill inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-primary-foreground">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Overview */}
            <section className="px py border-t border-foreground/10">
                <WipeLabel blockRef={overviewBlockRef} widthRef={overviewWidthRef} textRef={overviewTextRef} label="Overview" />
                <div className="grid md:grid-cols-2 gap-12 md:gap-24 mt-8">
                    <p className="g-overview-heading text-foreground text-xl md:text-3xl leading-relaxed">
                        Givtro is a consumer fintech app built for the Nigerian market — a single platform for moving money,
                        paying bills, buying gift cards, and managing a digital wallet.
                    </p>
                    <div className="flex flex-col gap-6 text-sm text-primary-foreground leading-relaxed">
                        <p className="g-overview-body">
                            I was the sole engineer on Givtro from architecture to delivery — designing and building the React Native
                            app, the Node.js/Express API, and every integration in between. No design handoff, no backend team.
                            Every decision from database schema to animation timing was mine.
                        </p>
                        <p className="g-overview-body">
                            The brief was to build something that felt premium and trustworthy in a market where most fintech apps
                            still feel like they were designed in 2015. That meant getting the details right — snappy transitions,
                            clear error states, and a transaction flow that never leaves the user guessing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="px py border-t border-foreground/10">
                <WipeLabel blockRef={featuresBlockRef} widthRef={featuresWidthRef} textRef={featuresTextRef} label="Features" />
                <div className="g-features-grid grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 mt-8">
                    {features.map((f) => (
                        <FeatureCard
                            key={f.number}
                            number={f.number}
                            title={f.title}
                            body={f.body}
                            brand={BRAND}
                        />
                    ))}
                </div>
            </section>

            {/* Engineering */}
            <section className="px py border-t border-foreground/10">
                <WipeLabel blockRef={engBlockRef} widthRef={engWidthRef} textRef={engTextRef} label="Engineering" />
                <div className="g-eng-grid grid md:grid-cols-2 gap-px bg-foreground/10 mt-8">

                    <div className="bg-primary p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-mono tracking-widest uppercase shrink-0" style={{ color: BRAND }}>Mobile</span>
                            <div ref={mobileLineRef} className="h-px flex-1 bg-foreground/10 origin-left" />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {stack.mobile.map((s) => <Pill key={s} label={s} />)}
                        </div>
                        <ul className="flex flex-col gap-4 text-sm text-primary-foreground leading-relaxed">
                            {[
                                "Responsive scaling system — all dimensions derived from a 390x844 base via s()/vs() utils",
                                "Biometric auth with expo-local-authentication, PIN fallback, and secure session persistence",
                                "Bottom sheet modals with drag/scroll conflict resolution via GestureHandlerRootView",
                                "TransactionConfirmModal with exhaustive error handling for every failure mode",
                                "React Query for server state, Zustand for local — clear separation of concerns",
                                "PlusJakartaSans font system with explicit fontWeight across all components",
                                "RectButton as the universal tap primitive — consistent ripple and touch feedback",
                            ].map((item) => (
                                <li key={item} className="g-eng-item flex gap-3">
                                    <span style={{ color: BRAND }} className="mt-1 shrink-0">—</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-primary p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-mono tracking-widest uppercase shrink-0" style={{ color: BRAND }}>Backend</span>
                            <div ref={backendLineRef} className="h-px flex-1 bg-foreground/10 origin-left" />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {[...stack.backend, ...stack.services].map((s, i) => <Pill key={`backend-${s}-${i}`} label={s} />)}
                        </div>
                        <ul className="flex flex-col gap-4 text-sm text-primary-foreground leading-relaxed">
                            {[
                                "RESTful API on Node.js/Express with full TypeScript coverage",
                                "JWT-based auth — access/refresh token rotation with device-bound sessions",
                                "KYC via N-Verify — BVN/NIN validation with tiered account limits",
                                "Reloadly for VTU (airtime, electricity, TV, betting) and gift cards",
                                "Cloudinary for profile picture storage with secure upload signatures",
                                "MongoDB with carefully indexed collections for wallet, transactions, and users",
                                "Transaction state machine — every operation flows through pending to processing to terminal",
                            ].map((item) => (
                                <li key={item} className="g-eng-item flex gap-3">
                                    <span style={{ color: BRAND }} className="mt-1 shrink-0">—</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Screens */}
            <section className="g-screens-section relative border-t border-foreground/10 w-full h-screen overflow-hidden">
                <div className="px relative pt-10 z-10">
                    <WipeLabel blockRef={screensBlockRef} widthRef={screensWidthRef} textRef={screensTextRef} label="Screens" />
                </div>

                {screens.map((img, i) => (
                    <div
                        key={i}
                        className="g-screen-card absolute will-change-transform z-20"
                        style={{
                            width: "clamp(100px, 12vw, 160px)",
                            aspectRatio: "9/19.5",
                            top: "30%",
                            left: 0,
                            marginTop: "-22vh",
                            borderRadius: "14px",
                            overflow: "hidden",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                        }}
                    >
                        <Image src={img.src} alt={img.alt} fill sizes="160px" className="object-cover" />
                    </div>
                ))}
            </section>

            {/* Project nav */}
            <section className="px py border-t border-foreground/10">
                <div className="flex items-center justify-between">
                    <div />
                    <Link href="/work/supadupa" className="link group inline-flex items-center gap-2 text-sm text-primary-foreground">
                        <span>SupaDupa</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </section>

        </main>
    );
}