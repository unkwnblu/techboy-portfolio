"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SERVICE_DATA: Record<string, {
    title: string;
    tagline: string;
    description: string;
    image: string;
    category: string;
    includes: string[];
    process: { step: string; detail: string }[];
}> = {
    "cinematic-videography": {
        title: "Cinematic Videography",
        tagline: "Frame every story with intention.",
        description:
            "From concept to final cut, I deliver high-end 4K and 6K video production built for commercial campaigns, narrative short films, music videos, and documentary projects. Every frame is crafted with deliberate lighting, intentional camera movement, and a sharp eye for storytelling.",
        image: "https://images.unsplash.com/photo-1589851610421-4f11550c60ba?w=1600&q=85",
        category: "videography",
        includes: [
            "Pre-production planning & shot listing",
            "4K / 6K camera acquisition",
            "Professional lighting setup",
            "Director of photography services",
            "On-set sound recording",
            "Full post-production & delivery",
        ],
        process: [
            { step: "Discovery", detail: "We discuss your vision, audience, and goals to align the creative direction." },
            { step: "Pre-Production", detail: "Shot lists, mood boards, location scouting, and scheduling are locked in." },
            { step: "Production", detail: "The shoot is executed with a professional crew and cinema-grade equipment." },
            { step: "Post-Production", detail: "Editing, color grading, sound design, and final export in your chosen format." },
            { step: "Delivery", detail: "Master files and web-optimized versions are delivered via secure link." },
        ],
    },
    "aerial-drone": {
        title: "Aerial Drone Operations",
        tagline: "See the world from above.",
        description:
            "Licensed FPV and stabilized drone cinematography that captures perspectives impossible from the ground. Whether you need sweeping establishing shots, dynamic chases, or intimate aerial close-ups, I bring the sky into your production.",
        image: "https://images.unsplash.com/photo-1579893962630-f80e9bd7f176?w=1600&q=85",
        category: "drone",
        includes: [
            "Licensed commercial drone pilot (LAANC certified)",
            "FPV freestyle and stabilized options",
            "4K aerial footage acquisition",
            "Airspace clearance coordination",
            "On-location flight planning",
            "Footage integration with ground production",
        ],
        process: [
            { step: "Site Assessment", detail: "Airspace restrictions, hazards, and optimal flight paths are mapped ahead of time." },
            { step: "Clearance", detail: "All necessary LAANC and regulatory approvals are secured." },
            { step: "Flight Ops", detail: "Precision flying to capture the planned shots safely and efficiently." },
            { step: "Review", detail: "Raw footage is reviewed on-site to confirm all required shots are covered." },
            { step: "Delivery", detail: "Graded and ungraded aerial files delivered alongside any ground footage." },
        ],
    },
    "photography": {
        title: "Photography",
        tagline: "Light, composition, emotion.",
        description:
            "Commercial and editorial photography that communicates with clarity and impact. Portraits, product shoots, event coverage, and documentary stills — each frame is composed to stand on its own and tell a complete story.",
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=85",
        category: "photography",
        includes: [
            "Commercial & editorial photography",
            "Portrait sessions (individual & brand)",
            "Product and lifestyle photography",
            "Event documentation",
            "On-location or studio setup",
            "Retouched high-resolution deliverables",
        ],
        process: [
            { step: "Brief", detail: "Understanding your brand, tone, and intended usage before the shoot." },
            { step: "Planning", detail: "Mood board, location selection, styling guidance, and call sheet." },
            { step: "Shoot Day", detail: "Creative direction on the day to capture authentic, polished imagery." },
            { step: "Culling & Editing", detail: "Best selects are retouched to a consistent, professional standard." },
            { step: "Delivery", detail: "Web and print-ready files delivered via gallery link." },
        ],
    },
    "post-production": {
        title: "Post-Production & Editing",
        tagline: "Where raw footage becomes a story.",
        description:
            "Expert offline and online editing, color grading, sound design, and narrative shaping. Whether you have raw footage that needs a skilled editor or need a complete post pipeline managed end-to-end, I handle every stage of the finishing process.",
        image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=1600&q=85",
        category: "editing",
        includes: [
            "Offline & online editing",
            "Professional color grading (DaVinci Resolve)",
            "Sound design & audio mix",
            "Motion graphics integration",
            "Subtitle & caption creation",
            "Multi-format export & delivery",
        ],
        process: [
            { step: "Ingest", detail: "All media is organized, transcoded if necessary, and backed up securely." },
            { step: "Rough Cut", detail: "A structural edit is assembled and shared for directional feedback." },
            { step: "Fine Cut", detail: "Pacing, transitions, and story flow are refined based on your notes." },
            { step: "Grade & Mix", detail: "Color and sound are brought to a broadcast-ready standard." },
            { step: "Delivery", detail: "Final master plus all required platform versions are exported and shared." },
        ],
    },
    "motion-graphics": {
        title: "Motion Graphics",
        tagline: "Animate your brand's voice.",
        description:
            "Dynamic animated visuals designed for brand identity, digital campaigns, commercials, and social media. From logo animations and lower thirds to full broadcast packages, every motion piece is crafted to be immediately recognizable and visually captivating.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85",
        category: "motion",
        includes: [
            "Logo reveals & brand animations",
            "Lower thirds & title sequences",
            "Social media reels & story graphics",
            "Explainer & product demo animations",
            "Broadcast opener packages",
            "After Effects & Cinema 4D production",
        ],
        process: [
            { step: "Concept", detail: "Creative direction is aligned with your brand guidelines and intended platform." },
            { step: "Storyboard", detail: "Key frames and motion flow are mapped out for approval before animation begins." },
            { step: "Animation", detail: "Full motion build in After Effects or Cinema 4D with refinements." },
            { step: "Review", detail: "Animated previews are shared for feedback and revision rounds." },
            { step: "Export", detail: "Final files delivered in all required formats (MP4, MOV, GIF, etc.)." },
        ],
    },
};

export default function ServiceDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const service = SERVICE_DATA[slug];

    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(
            ".detail-element",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out" }
        );
    }, { scope: container });

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-6 text-center px-8">
                <h1 className="text-6xl font-bold uppercase tracking-tighter">Not Found</h1>
                <p className="text-gray-400">That service doesn&apos;t exist.</p>
                <Link href="/services" className="text-sm uppercase tracking-widest hover:text-gray-400 transition-colors underline underline-offset-4">
                    Back to Services
                </Link>
            </div>
        );
    }

    return (
        <div ref={container} className="min-h-screen">
            {/* Hero */}
            <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
                <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />

                <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-16 max-w-7xl mx-auto w-full left-0 right-0">
                    <Link
                        href="/services"
                        className="detail-element flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-widest mb-8 w-fit"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Services
                    </Link>
                    <p className="detail-element text-gray-400 uppercase tracking-[0.3em] text-xs mb-4">
                        Service
                    </p>
                    <h1 className="detail-element text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter text-white leading-none">
                        {service.title}
                    </h1>
                    <p className="detail-element text-gray-300 text-lg md:text-2xl font-light mt-4 italic">
                        {service.tagline}
                    </p>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 md:py-28">
                {/* Description */}
                <div className="detail-element max-w-3xl mb-20 md:mb-28">
                    <p className="text-gray-300 text-xl md:text-2xl font-light leading-relaxed">
                        {service.description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-16 md:gap-24">
                    {/* What's Included */}
                    <div className="detail-element">
                        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">What&apos;s Included</h2>
                        <ul className="space-y-4">
                            {service.includes.map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-gray-300 text-base md:text-lg">
                                    <span className="text-white/20 font-mono text-xs pt-1.5 flex-shrink-0">
                                        0{i + 1}
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Process */}
                    <div className="detail-element">
                        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">The Process</h2>
                        <ol className="space-y-8">
                            {service.process.map((p, i) => (
                                <li key={i} className="border-l border-white/10 pl-6 relative">
                                    <div className="absolute -left-px top-0 w-px h-6 bg-white/40" />
                                    <p className="text-white font-semibold uppercase tracking-wide text-sm mb-1">
                                        {p.step}
                                    </p>
                                    <p className="text-gray-400 font-light text-sm leading-relaxed">
                                        {p.detail}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* CTA */}
                <div className="detail-element mt-24 md:mt-32 border-t border-white/10 pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                        <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
                            Ready to start a project?
                        </h3>
                        <p className="text-gray-400 font-light">
                            Get in touch and let&apos;s make something worth watching.
                        </p>
                    </div>
                    <Link
                        href={`/contact?category=${service.category}`}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm flex-shrink-0"
                    >
                        Get in Touch
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
