"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function MobileExperiencePopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on mobile/tablet
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    if (!isMobile) return;

    // Check if already dismissed this session
    const alreadyDismissed = sessionStorage.getItem("sl-popup-dismissed");
    if (alreadyDismissed) return;

    // Listen for hero-ready event
    const handler = () => {
      setTimeout(() => setVisible(true), 600);
    };

    window.addEventListener("hero-animations-complete", handler);
    return () => window.removeEventListener("hero-animations-complete", handler);
  }, []);

  useEffect(() => {
    if (!visible || dismissed) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: "power2.out" }
    ).fromTo(
      cardRef.current,
      { opacity: 0, y: 32, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
      "-=0.2"
    );
  }, [visible, dismissed]);

  const dismiss = () => {
    sessionStorage.setItem("sl-popup-dismissed", "1");

    const tl = gsap.timeline({ onComplete: () => setDismissed(true) });
    tl.to(cardRef.current, { opacity: 0, y: 16, scale: 0.97, duration: 0.4, ease: "power2.in" }).to(
      overlayRef.current,
      { opacity: 0, duration: 0.35, ease: "power2.in" },
      "-=0.15"
    );
  };

  if (!visible || dismissed) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 8888,
        background: "rgba(6,6,10,0.72)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0 0 clamp(24px,6vh,48px) 0",
      }}
      onClick={dismiss}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0e0e14",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "16px",
          padding: "clamp(24px,5vw,36px)",
          maxWidth: "clamp(300px,88vw,420px)",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Icon */}
        <div style={{ marginBottom: "16px" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="rgba(255,255,255,0.06)" />
            <path d="M13 8h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" fill="none"/>
            <circle cx="18" cy="24" r="1" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>

        <p style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>
          heads up
        </p>

        <h3 style={{ fontSize: "clamp(17px,4.5vw,20px)", fontWeight: 500, color: "#fff", lineHeight: 1.35, marginBottom: "12px" }}>
          Better on a bigger screen
        </h3>

        <p style={{ fontSize: "clamp(13px,3.5vw,14px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, marginBottom: "28px" }}>
          This portfolio was built for full immersion — custom cursor, cinematic transitions, and hover effects that need a desktop to sing. You can still browse, but the full experience awaits on PC.
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={dismiss}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "#fff",
              color: "#06060a",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              cursor: "pointer",
            }}
          >
            Continue anyway
          </button>
          <button
            onClick={dismiss}
            style={{
              padding: "12px 16px",
              background: "transparent",
              color: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}