"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowDown, Loader2, X } from "lucide-react";
import { useCursor } from "@/components/CursorContext";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

type ProjectWithMedia = Database['public']['Tables']['projects']['Row'] & {
  media: Database['public']['Tables']['media']['Row'][];
};

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const { setCursorText, setCursorVariant } = useCursor();

  const [featuredProjects, setFeaturedProjects] = useState<ProjectWithMedia[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [overlayVideo, setOverlayVideo] = useState<{ url: string; title: string } | null>(null);

  const VIDEO_CATEGORIES = new Set(['videography', 'drone pilot', 'video editor']);

  useEffect(() => {
    async function fetchFeatured() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          media (*)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (!error && data) {
        // Sort media for each project
        const processedData = data.map(project => ({
          ...project,
          media: project.media?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
        }));
        setFeaturedProjects(processedData);
      }
      setLoadingFeatured(false);
    }
    fetchFeatured();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverlayVideo(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = overlayVideo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [overlayVideo]);

  useGSAP(() => {
    // --- Hero Animations ---
    const tl = gsap.timeline({ delay: 3.5 }); // Wait for preloader

    tl.fromTo(
      ".hero-text",
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: "power4.out" }
    );

    tl.fromTo(
      ".scroll-indicator",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    // Subtle parallax on hero video
    gsap.to(videoRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // --- Manifesto Animations ---
    // Pin the right side media
    ScrollTrigger.create({
      trigger: manifestoRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: ".manifesto-media-container",
    });

    // Fade in text lines on left side
    gsap.utils.toArray<HTMLElement>('.manifesto-text').forEach((text) => {
      gsap.fromTo(
        text,
        { opacity: 0.2, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: text,
            start: "top 80%",
            end: "top 40%",
            scrub: true,
          }
        }
      );
    });

  }, { scope: container });

  return (
    <div ref={container} className="relative w-full bg-black">

      {/* 1. Cinematic Hero Section */}
      <section className="hero-section relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <video
            ref={videoRef}
            src="https://joy1.videvo.net/videvo_files/video/free/2016-01/large_watermarked/160111_19_LosAngeles_Night_01_1080p_preview.mp4"
            autoPlay
            loop
            muted
            playsInline
            suppressHydrationWarning
            className="w-full h-[120%] object-cover object-center absolute -top-[10%] opacity-80"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto flex flex-col items-center w-full mt-20">
          <div className="overflow-hidden w-full flex justify-center">
            <h1 className="hero-text text-[15vw] leading-[0.8] font-bold tracking-tighter uppercase text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.8)] pointer-events-none">
              SHOT BY
            </h1>
          </div>

          <div className="overflow-hidden w-full flex justify-center">
            <h1 className="hero-text text-[15vw] leading-[0.8] font-bold tracking-tighter uppercase text-white pointer-events-none mix-blend-difference">
              Techboy
            </h1>
          </div>

        </div>

        {/* Custom Magnetic Scroll Indicator */}
        <div
          className="scroll-indicator absolute bottom-12 z-30 flex flex-col items-center gap-4 cursor-pointer"
          onMouseEnter={() => setCursorVariant("video")}
          onMouseLeave={() => setCursorVariant("default")}
          onClick={() => {
            const manifesto = document.querySelector('.manifesto-section');
            if (manifesto) {
              manifesto.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/70 font-medium">Scroll</span>
          <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors backdrop-blur-sm">
            <ArrowDown className="w-4 h-4 text-white animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. The Manifesto / Intro (Sticky Scroll) */}
      <section ref={manifestoRef} className="manifesto-section relative w-full flex flex-col lg:flex-row pb-32">

        {/* Left Side: Scrolling Text */}
        <div className="w-full lg:w-1/2 pt-32 pb-[50vh] px-8 md:px-16 lg:px-24 flex flex-col justify-center gap-32">
          <h2 className="manifesto-text text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter leading-tight">
            I believe every frame must serve the narrative.
          </h2>
          <h2 className="manifesto-text text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter leading-tight text-gray-400">
            No empty beauty. No wasted motion.
          </h2>
          <h2 className="manifesto-text text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter leading-tight text-gray-600">
            Just pure, visceral storytelling crafted from light and time.
          </h2>

          <div className="manifesto-text mt-16 max-w-md">
            <p className="text-lg text-gray-400 font-light leading-relaxed">
              Based in Lagos, Nigeria, specializing in cutting-edge commercial campaigns, evocative documentaries, and precision drone cinematography. With years of experience operating high-end cinema systems, Seun's intent lies in pushing the boundaries of what's visually possible while remaining fiercely dedicated to the core emotion of your project.
            </p>
          </div>
        </div>

        {/* Right Side: Sticky Media */}
        <div className="hidden lg:block w-1/2 h-screen p-8 relative manifesto-media-container">
          <div className="w-full h-full rounded-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-1000 pointer-events-none" />
            <img
              src="https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?w=1200&q=80"
              alt="Behind the scenes"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 3. Featured Work — Horizontal Scroll */}
      <section className="py-32">
        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-16 text-center px-4 md:px-8">Selected Works</h2>

        {loadingFeatured ? (
          <div className="flex items-center justify-center h-[500px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : featuredProjects.length > 0 ? (
          <div
            className="flex gap-4 md:gap-6 overflow-x-auto px-4 md:px-8 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProjects.map((project) => {
              const mainMedia = project.media?.[0];
              const isVideoInput = mainMedia?.media_type === 'video';
              const mediaUrl = mainMedia?.file_url || "";
              const isVideoCategory = VIDEO_CATEGORIES.has(project.category ?? '');

              const cardInner = (
                <>
                  {isVideoInput ? (
                    <video
                      src={mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      suppressHydrationWarning
                      className="h-full w-auto"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={project.title}
                      className="h-full w-auto transform group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
                    <h3 className="text-xl font-bold uppercase tracking-wide">{project.title}</h3>
                    <p className="text-gray-400 text-sm capitalize mt-1">{project.category?.replace('_', ' ')}</p>
                  </div>
                </>
              );

              const sharedClass = "flex-shrink-0 h-[480px] md:h-[540px] rounded-2xl overflow-hidden relative group cursor-none bg-neutral-900 block";

              if (isVideoCategory) {
                return (
                  <div
                    key={project.id}
                    className={sharedClass}
                    onClick={() => mediaUrl && setOverlayVideo({ url: mediaUrl, title: project.title })}
                    onMouseEnter={() => { setCursorText("PLAY"); setCursorVariant("project"); }}
                    onMouseLeave={() => { setCursorText(""); setCursorVariant("default"); }}
                  >
                    {cardInner}
                  </div>
                );
              }

              return (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className={sharedClass}
                  onMouseEnter={() => { setCursorText(isVideoInput ? "PLAY" : "VIEW"); setCursorVariant("project"); }}
                  onMouseLeave={() => { setCursorText(""); setCursorVariant("default"); }}
                >
                  {cardInner}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] px-8">
            <p className="text-gray-500 font-medium tracking-widest uppercase text-sm">No featured works yet.</p>
          </div>
        )}
      </section>

      {/* 4. Dynamic Capabilities / Services */}
      <section className="services-section relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* We will handle hover state on the clientside via CSS sibling selectors or simple state. 
            For best performance with GSAP in a functional component, we handle hover events changing a local state. */}
        <DynamicServices />
      </section>

      {/* 5. Client Roster / Infinite Marquee */}
      <section className="py-24 bg-black border-y border-white/10 overflow-hidden flex items-center">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 md:gap-32 px-8 md:px-16">
              <span className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">Nike</span>
              <span className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">Porsche</span>
              <span className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">Red Bull</span>
              <span className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">Sony Music</span>
              <span className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">Vogue</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Massive CTA & Minimal Footer */}
      <section className="relative w-full min-h-screen bg-black flex flex-col items-center justify-between pt-32 pb-8 overflow-hidden z-20">
        <div className="absolute inset-0 bg-neutral-950 z-0" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4">
          <p className="text-sm uppercase tracking-[0.5em] text-gray-400 mb-8 font-medium">Ready to start?</p>
          <h2 className="text-[12vw] md:text-[10vw] font-bold uppercase tracking-tighter leading-none text-center hover:scale-105 transition-transform duration-700 cursor-pointer">
            <a href="/contact" className="text-white hover:text-transparent hover:[-webkit-text-stroke:2px_white] transition-colors duration-500">
              Let's Create
            </a>
          </h2>
        </div>

        <footer className="relative z-10 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8 pt-16 border-t border-white/10 mt-16">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="Techboy" className="h-8 w-auto" />
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">© {new Date().getFullYear()} All Rights Reserved.</p>
          </div>

          <div className="flex gap-8 text-sm uppercase tracking-widest font-medium">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Vimeo</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
          </div>
        </footer>
      </section>

      {/* Video overlay */}
      {overlayVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setOverlayVideo(null)}
        >
          <button
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
            onClick={() => setOverlayVideo(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative flex flex-col items-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={overlayVideo.url}
              className="max-h-[85vh] max-w-[90vw] w-auto rounded-xl shadow-2xl"
              controls
              autoPlay
            />
            <p className="text-white/40 text-xs uppercase tracking-widest mt-3 text-center">
              {overlayVideo.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component to manage the dynamic background state cleanly
function DynamicServices() {
  const [activebg, setActiveBg] = useState(0);
  const { setCursorVariant } = useCursor();

  const services = [
    { name: "Videography", href: "/portfolio?filter=videography", bg: "https://images.unsplash.com/photo-1537222716174-8b63e5276e0a?w=1600&q=80" },
    { name: "Drone Pilot", href: "/portfolio?filter=drone-pilot", bg: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1600&q=80" },
    { name: "Photography", href: "/portfolio?filter=photography", bg: "https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?w=1600&q=80" },
    { name: "Video Editor", href: "/portfolio?filter=video-editor", bg: "https://images.unsplash.com/photo-1473691955023-da1c49c95c78?w=1600&q=80" },
    { name: "Motion Graphics", href: "/portfolio?filter=motion-graphics", bg: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80" },
  ];

  return (
    <>
      <div className="absolute inset-0 z-0 bg-black">
        {services.map((srv, idx) => (
          <img
            key={idx}
            src={srv.bg}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${activebg === idx ? 'opacity-40' : 'opacity-0'}`}
            alt="Background"
          />
        ))}
      </div>

      <div
        className="relative z-10 w-full max-w-5xl px-8 py-20"
        onMouseEnter={() => setCursorVariant("project")}
        onMouseLeave={() => setCursorVariant("default")}
      >
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-12">Expertise</h3>
        <ul className="flex flex-col w-full border-t border-white/20">
          {services.map((srv, idx) => (
            <li
              key={idx}
              className="border-b border-white/20 group cursor-none"
              onMouseEnter={() => setActiveBg(idx)}
            >
              <a
                href={srv.href}
                className="py-8 md:py-12 flex items-center justify-between"
              >
                <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter text-gray-500 group-hover:text-white transition-colors duration-500 group-hover:translate-x-4 transform">
                  {srv.name}
                </h2>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
