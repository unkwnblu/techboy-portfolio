"use client";

import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // We can handle global ScrollTrigger updates here if necessary
        // lenis is automatically synced with ScrollTrigger if we set it up if needed.
        // ReactLenis does a lot of this out of the box now.
    }, []);

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
