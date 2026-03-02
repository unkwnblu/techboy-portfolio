"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCursor } from "./CursorContext";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const { cursorText, cursorVariant } = useCursor();

    useEffect(() => {
        const cursor = cursorRef.current;

        // Check if device has touch capability (hide custom cursor on mobile)
        if (window.matchMedia("(pointer: coarse)").matches) return;

        gsap.set(cursor, { xPercent: -50, yPercent: -50 });

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: "power2.out",
            });
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    // Update cursor style based on variant and text
    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        if (cursorVariant === "video" || cursorVariant === "project" || cursorText !== "") {
            gsap.to(cursor, {
                width: 80,
                height: 80,
                backgroundColor: "white",
                mixBlendMode: "normal",
                duration: 0.3,
            });
            gsap.to(textRef.current, { opacity: 1, duration: 0.3 });
        } else {
            gsap.to(cursor, {
                width: 20,
                height: 20,
                backgroundColor: "white",
                mixBlendMode: "difference",
                duration: 0.3,
            });
            gsap.to(textRef.current, { opacity: 0, duration: 0.3 });
        }
    }, [cursorText, cursorVariant]);

    // Hide on mobile via CSS
    return (
        <div
            ref={cursorRef}
            className="hidden md:flex fixed top-0 left-0 w-5 h-5 bg-white rounded-full pointer-events-none z-[100] items-center justify-center mix-blend-difference overflow-hidden"
        >
            <span
                ref={textRef}
                className="text-black text-[10px] font-bold tracking-widest uppercase opacity-0"
            >
                {cursorText}
            </span>
        </div>
    );
}
