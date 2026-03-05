"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function NotFound() {
    const container = useRef<HTMLDivElement>(null);
    const [timecode, setTimecode] = useState("00:00:00:00");

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const totalFrames = Math.floor((elapsed / 1000) * 24);
            const hours = Math.floor(totalFrames / (24 * 3600));
            const minutes = Math.floor((totalFrames % (24 * 3600)) / (24 * 60));
            const seconds = Math.floor((totalFrames % (24 * 60)) / 24);
            const frames = totalFrames % 24;
            setTimecode(
                `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(frames).padStart(2, "0")}`
            );
        }, 1000 / 24);
        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        // Entrance
        gsap.fromTo(
            ".fade-up",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out" }
        );

        // Recurring glitch burst
        const glitch = () => {
            const tl = gsap.timeline({
                onComplete: () => { gsap.delayedCall(gsap.utils.random(2, 5), glitch); },
            });

            tl.to(".glitch-main", { x: gsap.utils.random(-6, 6), skewX: gsap.utils.random(-2, 2), duration: 0.05, ease: "none" })
              .to(".glitch-main", { x: gsap.utils.random(-4, 4), skewX: 0, duration: 0.04, ease: "none" })
              .to(".glitch-main", { x: 0, duration: 0.05, ease: "none" });

            tl.to(".glitch-r", { x: gsap.utils.random(4, 10), opacity: 0.55, duration: 0.05, ease: "none" }, 0)
              .to(".glitch-b", { x: gsap.utils.random(-4, -10), opacity: 0.55, duration: 0.05, ease: "none" }, 0)
              .to([".glitch-r", ".glitch-b"], { x: 0, opacity: 0, duration: 0.06, ease: "none" });
        };

        gsap.delayedCall(1.2, glitch);

        // Scanline flicker
        gsap.to(".scanlines", {
            opacity: 0.04,
            duration: 0.08,
            repeat: -1,
            yoyo: true,
            ease: "none",
        });
    }, { scope: container });

    return (
        <div
            ref={container}
            className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4"
        >
            {/* Scanlines */}
            <div
                className="scanlines pointer-events-none absolute inset-0 z-20 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.025) 2px, rgba(255,255,255,0.025) 4px)",
                }}
            />

            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(255,255,255,0.02),transparent)] pointer-events-none" />

            {/* Top rule */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Logo */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <Link href="/">
                    <img
                        src="/logo.svg"
                        alt="Techboy"
                        className="h-7 w-auto opacity-40 hover:opacity-70 transition-opacity duration-300"
                    />
                </Link>
            </div>

            {/* Scene label — top left */}
            <div className="fade-up absolute top-8 left-8">
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/20 font-mono mb-0.5">Scene</p>
                <p className="text-[11px] font-mono text-white/30 tracking-wider">404 / NULL</p>
            </div>

            {/* Timecode — top right */}
            <div className="fade-up absolute top-8 right-8 text-right">
                <p className="text-[9px] uppercase tracking-[0.25em] text-white/20 font-mono mb-0.5">Timecode</p>
                <p className="text-[11px] font-mono text-white/30 tabular-nums tracking-wider">{timecode}</p>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center select-none flex flex-col items-center">

                {/* Glitch 404 */}
                <div className="relative">
                    {/* Red channel ghost */}
                    <h1
                        className="glitch-r absolute inset-0 font-bold leading-none tracking-tighter pointer-events-none opacity-0"
                        aria-hidden
                        style={{
                            fontSize: "clamp(8rem, 28vw, 22rem)",
                            color: "transparent",
                            WebkitTextStroke: "1px rgba(255,50,50,0.5)",
                            lineHeight: 1,
                            mixBlendMode: "screen",
                        }}
                    >
                        404
                    </h1>

                    {/* Blue channel ghost */}
                    <h1
                        className="glitch-b absolute inset-0 font-bold leading-none tracking-tighter pointer-events-none opacity-0"
                        aria-hidden
                        style={{
                            fontSize: "clamp(8rem, 28vw, 22rem)",
                            color: "transparent",
                            WebkitTextStroke: "1px rgba(50,50,255,0.5)",
                            lineHeight: 1,
                            mixBlendMode: "screen",
                        }}
                    >
                        404
                    </h1>

                    {/* Main 404 */}
                    <h1
                        className="glitch-main font-bold leading-none tracking-tighter"
                        style={{
                            fontSize: "clamp(8rem, 28vw, 22rem)",
                            color: "transparent",
                            WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                            lineHeight: 1,
                        }}
                    >
                        404
                    </h1>
                </div>

                {/* Copy block */}
                <div className="-mt-4 md:-mt-8 flex flex-col items-center">
                    <div className="w-16 h-px bg-white/20 mb-6" />
                    <p className="fade-up text-base md:text-xl font-bold uppercase tracking-[0.3em] text-white/70 mb-3">
                        Scene Missing
                    </p>
                    <p className="fade-up text-white/30 text-sm max-w-xs mx-auto mb-10 font-light leading-relaxed">
                        This frame was cut from the timeline. The page you're looking for no longer exists or was never shot.
                    </p>
                    <Link
                        href="/"
                        className="fade-up inline-flex items-center gap-3 border border-white/15 hover:border-white/40 text-white/50 hover:text-white/90 px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-white/5"
                    >
                        Back to Portfolio
                    </Link>
                </div>
            </div>

            {/* Film strip bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden opacity-[0.07]">
                <div className="h-full border-t border-white/30 flex">
                    {Array.from({ length: 32 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 border-r border-white/30"
                            style={{ backgroundColor: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent" }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom label */}
            <p className="absolute bottom-4 text-white/15 text-[10px] uppercase tracking-[0.3em]">
                Techboy Studio · Lagos, Nigeria
            </p>
        </div>
    );
}
