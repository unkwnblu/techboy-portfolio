"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ServicesPage() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(
            ".service-card",
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
        );
    }, { scope: container });

    const services = [
        {
            title: "Cinematic Videography",
            desc: "High-end 4K/6K video production tailored for commercial, narrative, and documentary projects.",
            image: "https://images.unsplash.com/photo-1589851610421-4f11550c60ba?w=800&q=80"
        },
        {
            title: "Aerial Drone Operations",
            desc: "Licensed FPV and stabilized drone filming capturing breathtaking perspectives and dynamic action.",
            image: "https://images.unsplash.com/photo-1579893962630-f80e9bd7f176?w=800&q=80"
        },
        {
            title: "Photography",
            desc: "Striking visual stills focused on lighting, composition, and raw emotion.",
            image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80"
        },
        {
            title: "Post-Production & Editing",
            desc: "Expert color grading, sound design, and narrative shaping to bring the final vision to life.",
            image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800&q=80"
        }
    ];

    return (
        <div ref={container} className="min-h-screen pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-16 px-4">
                    Services
                </h1>

                <div className="flex flex-col gap-8 md:gap-16">
                    {services.map((service, index) => (
                        <div key={index} className="service-card group relative h-[50vh] md:h-[60vh] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-700" />

                            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                                <p className="text-gray-300 tracking-widest uppercase text-sm mb-4 font-semibold">
                                    0{index + 1}
                                </p>
                                <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tight mb-4 group-hover:pl-4 transition-all duration-500">
                                    {service.title}
                                </h2>
                                <p className="max-w-xl text-gray-200 text-lg md:text-xl font-light opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100">
                                    {service.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
