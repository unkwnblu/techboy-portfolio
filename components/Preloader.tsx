"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Disable scrolling while preloader is active
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false);
                document.body.style.overflow = '';
            }
        });

        // Simulate loading percentage
        let progress = { value: 0 };
        tl.to(progress, {
            value: 100,
            duration: 2.5,
            ease: "power2.inOut",
            onUpdate: () => {
                if (counterRef.current) {
                    counterRef.current.innerText = Math.round(progress.value) + '%';
                }
            }
        }, 0);

        // Text animations
        tl.fromTo(
            textRef.current,
            { opacity: 0, y: 30, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
            0.5
        );

        tl.to(
            textRef.current,
            { opacity: 0, y: -30, scale: 1.1, duration: 0.8, ease: "power3.in" },
            2.2
        );

        // Slide out preloader
        tl.to(
            containerRef.current,
            {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut"
            },
            3.0
        );

    }, []);

    if (!isLoading) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center pointer-events-none"
        >
            <div
                ref={textRef}
                className="flex flex-col items-center gap-4 text-white uppercase tracking-[0.5em]"
            >
                <span className="text-sm font-light text-gray-400">Loading Experience</span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Cinematic</h1>
            </div>

            <div
                ref={counterRef}
                className="absolute bottom-12 right-12 text-6xl md:text-9xl font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.1)] tracking-tighter"
            >
                0%
            </div>
        </div>
    );
}
