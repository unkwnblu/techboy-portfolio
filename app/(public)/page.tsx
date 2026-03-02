"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".hero-text",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.5 }
    );

    tl.fromTo(
      ".hero-subtext",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    // Parallax video effect
    gsap.to(videoRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative w-full h-[200vh]">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <video
            ref={videoRef}
            src="https://cdn.pixabay.com/video/2023/10/22/186004-876939634_large.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-[120%] object-cover object-center absolute -top-[10%]"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <div className="overflow-hidden">
            <h1 className="hero-text text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase">
              Capture
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="hero-text text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase text-transparent [-webkit-text-stroke:2px_white]">
              The Unseen
            </h1>
          </div>

          <p className="hero-subtext mt-8 text-lg md:text-xl font-light tracking-wide max-w-2xl text-gray-300">
            Cinematic Photography, Videography & Aerial Drone Operations
          </p>

          <Link href="/portfolio" className="hero-subtext mt-12 flex items-center gap-2 group px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
            Explore Work
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Featured Projects Preview Section (Placeholder for now) */}
      <section className="relative z-20 bg-black py-32 px-8 min-h-screen">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-16">
          Selected Works
        </h2>
        {/* We will fetch featured projects from Supabase in subsequent steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="aspect-[4/5] bg-neutral-900 rounded-xl overflow-hidden group relative cursor-pointer">
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                <span className="text-white font-medium tracking-widest uppercase border border-white/30 px-6 py-3 rounded-full backdrop-blur-sm">View Project</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
