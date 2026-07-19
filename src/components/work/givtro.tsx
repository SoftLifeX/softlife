"use client";

import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap-init";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";
import { registerWipe } from "@/hooks/useWipeReveal";
import { usePageReady } from "@/hooks/usePageReady";
import { useGsapScope } from "@/hooks/useGsapScope";
import Magnetic from "@/components/magnetic";
import { WipeLabel, useWipeRefs } from "@/lib/animations/wipeLabel";
import { EASE } from "@/lib/animations/tokens";
import mockup from "@/app/assets/projects/givtro/givtro_mockup.webp";
import g1 from "@/app/assets/projects/givtro/givtro_1.webp";
import g4 from "@/app/assets/projects/givtro/givtro_4.webp";
import g10 from "@/app/assets/projects/givtro/givtro_10.webp";
import g13 from "@/app/assets/projects/givtro/givtro_13.webp";
import g16 from "@/app/assets/projects/givtro/givtro_16.webp";
import g19 from "@/app/assets/projects/givtro/givtro_19.webp";
import FeatureCard from "@/components/ui/featureCard";

const BRAND = "#2466F2";

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

type ScreenAccentData = { src: StaticImageData; alt: string };

const overviewAccent: ScreenAccentData = { src: g1, alt: "Givtro home dashboard" };
const featuresAccentA: ScreenAccentData = { src: g10, alt: "Gift card catalogue" };
const featuresAccentB: ScreenAccentData = { src: g13, alt: "KYC verification" };
const engMobileAccent: ScreenAccentData = { src: g4, alt: "Transaction confirmation" };
const engBackendAccent: ScreenAccentData = { src: g16, alt: "Agent dashboard" };
const closingAccent: ScreenAccentData = { src: g19, alt: "Onboarding flow" };

function ScreenAccent({ item, className }: { item: ScreenAccentData; className?: string }) {
    return (
        <Magnetic fullWidth strength={0} tiltStrength={5}>
            <div
                className={cn(
                    "g-screen-card gsap-hide group1 relative w-full shrink-0 overflow-hidden rounded-[14px]",
                    "shadow-[0_20px_40px_rgba(0,0,0,0.45)] bg-foreground/5",
                    className
                )}
            >
                <div style={{ paddingBottom: `${(19.5 / 9) * 100}%` }} />

                <div className="parallax-container absolute inset-0 overflow-hidden rounded-[14px]">
                    <div className="relative h-[120%] w-full -top-[10%]">
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            loading="eager"
                            sizes="200px"
                            className="object-cover transition-transform duration-700 ease-out group1-hover:scale-[1.03]"
                        />
                    </div>
                </div>
            </div>
        </Magnetic>
    );
}

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

export default function GivtroPage() {
    const pageRef = useRef<HTMLElement>(null);
    const ready = usePageReady();

    const overviewLabel = useWipeRefs();
    const featuresLabel = useWipeRefs();
    const engLabel = useWipeRefs();

    const mobileLineRef = useRef<HTMLDivElement>(null);
    const backendLineRef = useRef<HTMLDivElement>(null);
    const vLineRef = useRef<HTMLDivElement>(null);

    useGsapScope(pageRef, {
        ready,

        reducedMotionFallback: () => {
            gsap.set(
                ".g-title, .g-meta, .g-gallery-item, .g-overview-heading, .g-overview-body, .g-pill, .g-feature, .g-eng-item, .g-screen-card",
                { visibility: "visible", opacity: 1, y: 0, x: 0, scale: 1 }
            );
            gsap.set([overviewLabel.textRef.current, featuresLabel.textRef.current, engLabel.textRef.current], {
                visibility: "visible",
                opacity: 1,
            });
            gsap.set(
                [overviewLabel.widthRef.current, featuresLabel.widthRef.current, engLabel.widthRef.current, mobileLineRef.current, backendLineRef.current],
                { scaleX: 1, width: "100%" }
            );
            gsap.set(vLineRef.current, { scaleY: 1 });
        },

        animate: () => {
            gsap.set(".g-meta", { visibility: "visible", y: 16, opacity: 0 });
            gsap.to(".g-meta", { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: EASE, delay: 0.4 });

            gsap.set(".g-gallery-item", { visibility: "visible", opacity: 0, scale: 0.98 });
            gsap.to(".g-gallery-item", { opacity: 1, scale: 1, duration: 0.8, ease: EASE, delay: 0.2 });

            const pills = gsap.utils.toArray<HTMLElement>(".g-pill");
            gsap.set(pills, { visibility: "visible", scale: 0.88, opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" });
            gsap.to(pills, {
                scale: 1, opacity: 1, duration: 0.28, ease: "power3.out", stagger: 0.07,
                scrollTrigger: { trigger: pills[0]?.parentElement, start: "top 80%", end: "top 60%", scrub: true },
                onComplete: () => {
                    gsap.set(pills, { willChange: "auto" });
                },
            });

            [
                { refs: overviewLabel, offset: "top 90%" },
                { refs: featuresLabel, offset: "top 90%" },
                { refs: engLabel, offset: "top 90%" },
            ].forEach(({ refs, offset }) => {
                gsap.set(refs.textRef.current, { visibility: "visible" });
                registerWipe(refs, { trigger: () => refs.textRef.current, direction: "left", startOffset: offset, ease: EASE });
            });

            gsap.set(".g-feature", { visibility: "visible", y: 32, opacity: 0 });
            gsap.to(".g-feature", {
                y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: EASE,
                scrollTrigger: { trigger: ".g-features-grid", start: "top 80%", toggleActions: "play none none none" },
            });

            [mobileLineRef, backendLineRef].forEach((lineRef) => {
                gsap.from(lineRef.current, {
                    scaleX: 0,
                    transformOrigin: "left center",
                    ease: EASE,
                    scrollTrigger: { trigger: lineRef.current, start: "top 80%", end: "top 60%", scrub: true },
                });
            });

            gsap.from(vLineRef.current, {
                scaleY: 0,
                transformOrigin: "top center",
                ease: EASE,
                scrollTrigger: { trigger: vLineRef.current, start: "top 80%", end: "top 60%", scrub: true },
            });

            gsap.set(".g-eng-item", { visibility: "visible", x: -20, opacity: 0 });
            gsap.to(".g-eng-item", {
                x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: EASE,
                scrollTrigger: { trigger: ".g-eng-grid", start: "top 75%", toggleActions: "play none none none" },
            });
            
            const isMobile = window.innerWidth < 768;
            const yAmt = isMobile ? 8 : 12;

            gsap.utils.toArray<HTMLElement>(".parallax-container").forEach((container) => {
                const img = container.querySelector<HTMLImageElement>("img");
                if (!img) return;
                gsap.fromTo(
                    img,
                    { yPercent: -yAmt },
                    { yPercent: yAmt, ease: "none", scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top", scrub: 0.4 } }
                );
            });

            gsap.set(".g-screen-card", { visibility: "visible", y: 40, opacity: 0 });
            gsap.utils.toArray<HTMLElement>(".g-screen-card").forEach((card) => {
                gsap.to(card, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: EASE,
                    scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
                });
            });
        },

        animateWithSplitText: (ctx) => {
            gsap.set(".g-title, .g-overview-heading, .g-overview-body", { visibility: "visible" });

            const titleSplit = new SplitText(".g-title", { type: "chars, words", mask: "chars" });
            gsap.set(titleSplit.chars, { xPercent: 100, opacity: 0 });
            gsap.to(titleSplit.chars, { xPercent: 0, opacity: 1, stagger: 0.04, duration: 0.7, ease: EASE, delay: 0.1 });

            const overviewSplit = new SplitText(".g-overview-heading", { type: "words, lines" });
            gsap.set(overviewSplit.words, { opacity: 0, y: 20 });
            gsap.to(overviewSplit.words, {
                opacity: 1, y: 0, ease: EASE, stagger: 0.02,
                scrollTrigger: { trigger: ".g-overview-heading", start: "top 80%", end: "top 55%", scrub: true },
            });

            const bodySplit = new SplitText(".g-overview-body", { type: "words, lines" });
            gsap.set(bodySplit.words, { opacity: 0, y: 20 });
            gsap.to(bodySplit.words, {
                opacity: 1, y: 0, ease: EASE, stagger: 0.015,
                scrollTrigger: { trigger: ".g-overview-body", start: "top 85%", end: "top 60%", scrub: true },
            });

            ctx.add(() => () => {
                titleSplit.revert();
                overviewSplit.revert();
                bodySplit.revert();
            });
        },
    });

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
                        <div className="g-meta gsap-hide flex items-center gap-3 mb-6">
                            <GivtroLogo size={36} />
                            <span className="text-sm text-primary-foreground">Naelix Technologies</span>
                        </div>
                        <h1 className="g-title gsap-hide text-4xl md:text-8xl font-bold leading-tight text-foreground mb-4">
                            Givtro
                        </h1>
                        <p className="g-meta gsap-hide text-sm text-primary-foreground max-w-md">
                            A full-featured Nigerian fintech platform — mobile-first, built solo across the entire stack.
                        </p>
                    </div>
                    <div className="g-meta gsap-hide flex flex-col gap-2 text-sm md:items-end">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: BRAND }} />
                            <span className="text-primary-foreground">Coming Soon</span>
                        </div>
                        <span className="text-primary-foreground">2024 — 2025</span>
                        <span className="text-primary-foreground">Solo Engineer — Full-Stack</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
                    <div className="g-gallery-item gsap-hide relative w-full overflow-hidden rounded-xl bg-foreground/5" style={{ aspectRatio: "9/10" }}>
                        <Image src={mockup} alt="Givtro" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </div>

                    <div className="g-pills flex flex-wrap gap-2 content-start">
                        {[...stack.mobile, ...stack.backend, ...stack.services].map((s, i) => (
                            <span key={`${s}-${i}`} className="g-pill gsap-hide inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-primary-foreground">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px py border-t border-foreground/10">
                <div className="flex gap-16 items-start">
                    <div className="flex-1 min-w-0">
                        <WipeLabel {...overviewLabel} label="Overview" />
                        <div className="grid md:grid-cols-2 gap-12 md:gap-24 mt-8">
                            <p className="g-overview-heading gsap-hide text-foreground text-xl md:text-3xl leading-relaxed">
                                Givtro is a consumer fintech app built for the Nigerian market — a single platform for moving
                                money, paying bills, buying gift cards, and managing a digital wallet.
                            </p>
                            <div className="flex flex-col gap-6 text-sm text-primary-foreground leading-relaxed">
                                <p className="g-overview-body gsap-hide">
                                    I was the sole engineer on Givtro from architecture to delivery — designing and building the
                                    React Native app, the Node.js/Express API, and every integration in between. No design
                                    handoff, no backend team. Every decision from database schema to animation timing was mine.
                                </p>
                                <p className="g-overview-body gsap-hide">
                                    The brief was to build something that felt premium and trustworthy in a market where most
                                    fintech apps still feel like they were designed in 2015. That meant getting the details right
                                    — snappy transitions, clear error states, and a transaction flow that never leaves the user
                                    guessing.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden xl:block w-36 shrink-0 pt-14">
                        <ScreenAccent item={overviewAccent} className="rotate-3" />
                    </div>
                </div>
            </section>
            
            <section className="px py border-t border-foreground/10">
                <div className="flex gap-16 items-start">
                    <div className="flex-1 min-w-0">
                        <WipeLabel {...featuresLabel} label="Features" />
                        <div className="g-features-grid grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 mt-8">
                            {features.map((f) => (
                                <FeatureCard
                                    key={f.number}
                                    number={f.number}
                                    title={f.title}
                                    body={f.body}
                                    brand={BRAND}
                                    className="gsap-hide"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="hidden xl:flex flex-col gap-14 w-36 shrink-0 pt-20">
                        <ScreenAccent item={featuresAccentA} className="-rotate-2" />
                        <ScreenAccent item={featuresAccentB} className="rotate-2" />
                    </div>
                </div>
            </section>

            <section className="px py border-t border-foreground/10">
                <WipeLabel {...engLabel} label="Engineering" />
                <div className="g-eng-grid relative grid md:grid-cols-2 gap-px mt-8">

                    <div
                        ref={vLineRef}
                        aria-hidden="true"
                        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 origin-top bg-foreground/10"
                    />

                    <div className="bg-primary p-6 md:p-10">
                        <div className="flex items-start justify-between gap-6 mb-6">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-xs font-mono tracking-widest uppercase shrink-0" style={{ color: BRAND }}>Mobile</span>
                                <div ref={mobileLineRef} className="h-px flex-1 bg-foreground/10 origin-left" />
                            </div>
                            <div className="hidden lg:block w-20 shrink-0 -mt-2 -mr-2">
                                <ScreenAccent item={engMobileAccent} className="rotate-2" />
                            </div>
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
                                <li key={item} className="g-eng-item gsap-hide flex gap-3">
                                    <span style={{ color: BRAND }} className="mt-1 shrink-0">—</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-primary p-6 md:p-10">
                        <div className="flex items-start justify-between gap-6 mb-6">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-xs font-mono tracking-widest uppercase shrink-0" style={{ color: BRAND }}>Backend</span>
                                <div ref={backendLineRef} className="h-px flex-1 bg-foreground/10 origin-left" />
                            </div>
                            <div className="hidden lg:block w-20 shrink-0 -mt-2 -mr-2">
                                <ScreenAccent item={engBackendAccent} className="-rotate-2" />
                            </div>
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
                                <li key={item} className="g-eng-item gsap-hide flex gap-3">
                                    <span style={{ color: BRAND }} className="mt-1 shrink-0">—</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            
            <section className="px py border-t border-foreground/10">
                <div className="flex items-center justify-between">
                    <div className="w-16 md:w-20">
                        <ScreenAccent item={closingAccent} className="-rotate-3" />
                    </div>
                    <Link href="/work/supadupa" className="link group inline-flex items-center gap-2 text-sm text-primary-foreground">
                        <span>SupaDupa</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </section>

        </main>
    );
}