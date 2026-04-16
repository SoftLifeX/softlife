"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

interface Particle {
  x: number; y: number;
  ox: number; oy: number;
  tx: number; ty: number;
  vx: number; vy: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  delay: number;
  color: string;
  exploded: boolean;
  eangle: number;
  espeed: number;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const rootRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const brandRef   = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const pbarRef    = useRef<HTMLDivElement>(null);
  const pfillRef   = useRef<HTMLDivElement>(null);
  const exitRef    = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(true);
  const afRef      = useRef<number | null>(null);
  const startRef   = useRef<number | null>(null);
  const progVal    = useRef(0);
  const progTarget = useRef(0);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const getTextTargets = useCallback((
    text: string, cx: number, cy: number, fontSize: number, W: number, H: number
  ) => {
    const off = document.createElement("canvas");
    const fs  = fontSize * 2;
    off.width  = W * 2;
    off.height = H * 2;
    const oc = off.getContext("2d")!;
    oc.font          = `500 ${fs}px system-ui, sans-serif`;
    oc.fillStyle     = "#fff";
    oc.textAlign     = "center";
    oc.textBaseline  = "middle";
    oc.fillText(text, W, H);
    const data = oc.getImageData(0, 0, off.width, off.height).data;
    const pts: { x: number; y: number }[] = [];
    const step = 6;
    for (let py = 0; py < off.height; py += step)
      for (let px = 0; px < off.width; px += step)
        if (data[(py * off.width + px) * 4 + 3] > 128)
          pts.push({ x: px / 2 - W / 2 + cx, y: py / 2 - H / 2 + cy });
    return pts;
  }, []);

  const makeParticle = useCallback((tx: number, ty: number): Particle => {
    const angle  = Math.random() * Math.PI * 2;
    const spread = Math.random() * 300 + 120;
    const x = tx + Math.cos(angle) * spread;
    const y = ty + Math.sin(angle) * spread;
    return {
      x, y, ox: x, oy: y, tx, ty,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size:        Math.random() * 1.6 + 0.5,
      alpha:       0,
      targetAlpha: Math.random() * 0.5 + 0.3,
      delay:       Math.random() * 600,
      color:       Math.random() > 0.85
        ? "rgba(200,190,255,"
        : "rgba(255,255,255,",
      exploded: false, eangle: 0, espeed: 0,
    };
  }, []);

  // ─── Main loop ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    let W = 0, H = 0, dpr = 1;
    let particles: Particle[] = [];

    const phaseDurations = { drift: 1800, converge: 1400, hold: 900, explode: 800 };
    const driftEnd    = phaseDurations.drift;
    const convergeEnd = driftEnd    + phaseDurations.converge;
    const holdEnd     = convergeEnd + phaseDurations.hold;
    const explodeEnd  = holdEnd     + phaseDurations.explode;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W   = window.innerWidth;
      H   = window.innerHeight;
      canvas.width  = W * dpr; canvas.height = H * dpr;
      canvas.style.width  = W + "px"; canvas.style.height = H + "px";
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    function init() {
      particles = [];
      const cx = W / 2, cy = H / 2;
      const fs = Math.min(W * 0.1, 108);
      const targets = getTextTargets("Softlife", cx, cy, fs, W, H);
      particles = targets.map((p) => makeParticle(p.x, p.y));
    }
    init();

    // Progress simulation
    const bumper = setInterval(() => {
      progTarget.current = Math.min(progTarget.current + Math.random() * 15 + 5, 88);
    }, 300);

    // Fonts + min time gate
    const minTime = new Promise<void>((r) => setTimeout(r, driftEnd + phaseDurations.converge + phaseDurations.hold + 200));
    const fonts   = document.fonts?.ready ?? Promise.resolve();

    Promise.all([minTime, fonts]).then(() => {
      clearInterval(bumper);
      progTarget.current = 100;
    });

    function draw(timestamp: number) {
      if (!startRef.current) startRef.current = timestamp;
      const t = timestamp - startRef.current;

      // Progress bar
      progVal.current += (progTarget.current - progVal.current) * 0.04;
      if (pfillRef.current)
        pfillRef.current.style.width = Math.min(progVal.current, 100) + "%";

      // Determine phase
      let phase: string, phaseProgress: number;
      if      (t < driftEnd)    { phase = "drift";   phaseProgress = t / driftEnd; }
      else if (t < convergeEnd) { phase = "converge"; phaseProgress = (t - driftEnd)    / phaseDurations.converge; }
      else if (t < holdEnd)     { phase = "hold";     phaseProgress = (t - convergeEnd) / phaseDurations.hold; }
      else if (t < explodeEnd)  { phase = "explode";  phaseProgress = (t - holdEnd)     / phaseDurations.explode; }
      else                      { phase = "done";     phaseProgress = 1; }

      // Show progress bar
      if (t > driftEnd * 0.6 && pbarRef.current && pbarRef.current.style.opacity === "0") {
        gsap.to(pbarRef.current, { opacity: 1, duration: 0.5 });
        gsap.to(subRef.current,  { opacity: 1, duration: 0.8 });
      }

      if (phase === "done") {
        cancelAnimationFrame(afRef.current!);
        if (pfillRef.current) pfillRef.current.style.width = "100%";
        gsap.to(brandRef.current, { opacity: 0, duration: 0.4, delay: 0.1 });
        gsap.to([pbarRef.current, subRef.current], { opacity: 0, duration: 0.35 });
        gsap.to(exitRef.current, {
          opacity: 1, duration: 0.65, delay: 0.3,
          onComplete: () => { setVisible(false); onComplete(); },
        });
        return;
      }

      // Brand fade
      if (brandRef.current) {
        if      (phase === "hold")    brandRef.current.style.opacity = String(Math.min(phaseProgress * 3, 1));
        else if (phase === "explode") brandRef.current.style.opacity = String(Math.max(1 - phaseProgress * 2.5, 0));
        else                          brandRef.current.style.opacity = "0";
      }

      ctx.clearRect(0, 0, W, H);

      // Vignette
      const vg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.65);
      vg.addColorStop(0, "rgba(6,6,10,0)");
      vg.addColorStop(1, "rgba(6,6,10,0.75)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      // Update + draw particles
      for (const p of particles) {
        if      (phase === "drift") {
          if (t > p.delay) {
            p.alpha = Math.min(p.alpha + 0.015, p.targetAlpha * 0.6);
            p.x += p.vx; p.y += p.vy;
          }
        } else if (phase === "converge") {
          const ease = 1 - Math.pow(1 - phaseProgress, 3);
          p.x = p.ox + (p.tx - p.ox) * ease;
          p.y = p.oy + (p.ty - p.oy) * ease;
          p.alpha = p.targetAlpha * (0.4 + ease * 0.6);
        } else if (phase === "hold") {
          p.x = p.tx + Math.sin(t * 0.003 + p.delay) * 0.4;
          p.y = p.ty + Math.cos(t * 0.002 + p.delay) * 0.4;
          p.alpha = p.targetAlpha;
        } else if (phase === "explode") {
          if (!p.exploded) {
            p.eangle = Math.random() * Math.PI * 2;
            p.espeed = Math.random() * 18 + 6;
            p.exploded = true;
          }
          p.x += Math.cos(p.eangle) * p.espeed * (1 - phaseProgress);
          p.y += Math.sin(p.eangle) * p.espeed * (1 - phaseProgress) + p.espeed * 0.3;
          p.alpha = p.targetAlpha * Math.max(1 - phaseProgress * 1.2, 0);
        }

        if (p.alpha <= 0) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();
      }

      // Mesh lines in hold phase
      if (phase === "hold" && phaseProgress > 0.3) {
        const lineAlpha = Math.min((phaseProgress - 0.3) / 0.7, 1) * 0.055;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i += 3) {
          for (let j = i + 1; j < particles.length; j += 3) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = dx * dx + dy * dy;
            if (dist < 400) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255,255,255,${lineAlpha * (1 - dist / 400)})`;
              ctx.stroke();
            }
          }
        }
      }

      afRef.current = requestAnimationFrame(draw);
    }

    afRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(bumper);
      if (afRef.current) cancelAnimationFrame(afRef.current);
    };
  }, [getTextTargets, makeParticle, onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#06060a", display: "flex",
        alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />

      

      {/* Sub label */}
      <div
        ref={subRef}
        style={{
          position: "absolute", zIndex: 2, opacity: 0,
          bottom: "clamp(80px, 12vh, 120px)",
          fontSize: "clamp(9px,1.1vw,11px)",
          letterSpacing: "0.42em",
          color: "rgba(255,255,255,0.22)",
          textTransform: "uppercase",
          fontFamily: "system-ui, sans-serif",
          pointerEvents: "none",
        }}
      >
        the only one
      </div>

      {/* Progress bar */}
      <div
        ref={pbarRef}
        style={{
          position: "absolute", zIndex: 2, opacity: 0,
          bottom: "clamp(54px, 8vh, 80px)",
          left: "50%", transform: "translateX(-50%)",
          width: "clamp(100px, 20vw, 180px)",
          height: "1px",
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          ref={pfillRef}
          style={{
            position: "absolute", inset: 0, width: "0%",
            background: "rgba(255,255,255,0.65)",
            transition: "width 0.05s linear",
          }}
        />
      </div>

      {/* Exit overlay */}
      <div
        ref={exitRef}
        style={{
          position: "absolute", inset: 0,
          background: "#06060a", opacity: 0,
          pointerEvents: "none", zIndex: 20,
        }}
      />
    </div>
  );
}