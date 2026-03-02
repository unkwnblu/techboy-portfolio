"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCursor } from "@/components/CursorContext";
import { ChevronDown } from "lucide-react";

export default function AboutPage() {
    const container = useRef<HTMLDivElement>(null);
    const { setCursorVariant } = useCursor();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useGSAP(() => {
        gsap.fromTo(
            ".about-fade",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out" }
        );
    }, { scope: container });

    return (
        <div ref={container} className="min-h-screen pt-32 pb-20 px-8 max-w-7xl mx-auto flex flex-col items-center">
            <h1 className="about-fade w-full text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-16 text-center">
                The Visionary
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="about-fade relative aspect-[3/4] rounded-2xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1554046920-90dcac0536d1?w=800&q=80"
                        alt="Creator behind the scenes"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                </div>

                <div className="about-fade space-y-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-light leading-snug">
                        Relentlessly pursuing the perfect frame. Specializing in high-end commercial visuals, evocative narratives, and bleeding-edge drone cinematography.
                    </h2>

                    <p className="text-gray-400 leading-relaxed text-lg font-light">
                        With years of experience blending technical precision with artistic intuition, every project is approached not just as a job, but as an opportunity to craft a cinematic masterpiece. From freezing split-second moments in time to sweeping aerial vistas, my goal is to elevate your story above the noise.
                    </p>

                    <div
                        className="pt-8 border-t border-gray-800"
                        onMouseEnter={() => setCursorVariant("project")}
                        onMouseLeave={() => setCursorVariant("default")}
                    >
                        <h3 className="text-xl font-semibold uppercase tracking-widest mb-6 border-l-2 border-white pl-4">Gear Arsenal</h3>
                        <div className="space-y-2">
                            {[
                                { category: "Main Camera", items: "RED Komodo-X / Sony FX6 / Alexa Mini LF" },
                                { category: "Drone Systems", items: "DJI Inspire 3 / Custom 5\" FPV / Mavic 3 Cine" },
                                { category: "Lenses", items: "Atlas Orion Anamorphic / Sigma Cine Primes / Cooke Panchro" },
                                { category: "Post & Color", items: "DaVinci Resolve Studio / Premiere Pro / Flanders Scientific" },
                            ].map((gear, idx) => (
                                <div key={idx} className="border-b border-gray-900 overflow-hidden">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                        className="w-full py-4 flex items-center justify-between text-left group"
                                    >
                                        <span className="font-bold text-gray-200 uppercase tracking-wider group-hover:text-white transition-colors">{gear.category}</span>
                                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-500 ${openIndex === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div
                                        className="transition-all duration-500 ease-in-out"
                                        style={{
                                            maxHeight: openIndex === idx ? '200px' : '0px',
                                            opacity: openIndex === idx ? 1 : 0
                                        }}
                                    >
                                        <p className="pb-4 text-gray-400 font-light truncate">{gear.items}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
