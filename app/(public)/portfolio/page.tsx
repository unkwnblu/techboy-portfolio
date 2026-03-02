"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Loader2, X } from "lucide-react";
import { useCursor } from "@/components/CursorContext";
import Link from "next/link";

type Project = Database['public']['Tables']['projects']['Row'] & {
    media: Database['public']['Tables']['media']['Row'][];
};

const VIDEO_CATEGORIES = new Set(['videography', 'drone pilot', 'video editor']);

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filter, setFilter] = useState<'all' | 'videography' | 'drone pilot' | 'photography' | 'video editor' | 'motion graphics'>('all');
    const [loading, setLoading] = useState(true);
    const [overlayVideo, setOverlayVideo] = useState<{ url: string; title: string } | null>(null);
    const supabase = createClient();
    const { setCursorText, setCursorVariant } = useCursor();

    useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase
                .from('projects')
                .select(`*, media (*)`)
                .order('created_at', { ascending: false });

            if (data) setProjects(data as unknown as Project[]);
            setLoading(false);
        }
        fetchProjects();
    }, [supabase]);

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
        if (!loading) {
            gsap.fromTo(
                ".portfolio-item",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }
            );
        }
    }, [loading, filter]);

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category === filter);

    const filters = [
        { label: 'All', value: 'all' },
        { label: 'Videography', value: 'videography' },
        { label: 'Drone Pilot', value: 'drone pilot' },
        { label: 'Photography', value: 'photography' },
        { label: 'Video Editor', value: 'video editor' },
        { label: 'Motion Graphics', value: 'motion graphics' },
    ] as const;

    const sharedCardClass = "block cursor-none group relative rounded-xl overflow-hidden break-inside-avoid shadow-2xl bg-neutral-900";

    return (
        <div className="min-h-screen pt-32 px-8 pb-20 max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-12">
                Portfolio
            </h1>

            <div className="flex flex-wrap gap-4 mb-12">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`px-6 py-2 rounded-full border transition-all text-sm uppercase tracking-widest ${filter === f.value
                            ? "bg-white text-black border-white"
                            : "border-gray-800 text-gray-400 hover:border-gray-500"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {filteredProjects.map((project) => {
                        const coverMedia = project.media?.[0];
                        const isVideoCategory = VIDEO_CATEGORIES.has(project.category);

                        const cardInner = (
                            <div className="portfolio-item pointer-events-none">
                                {coverMedia ? (
                                    coverMedia.media_type === 'video' ? (
                                        <video
                                            src={coverMedia.file_url}
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                            muted
                                            loop
                                            playsInline
                                            autoPlay={isVideoCategory}
                                            onMouseEnter={(e) => !isVideoCategory && e.currentTarget.play()}
                                            onMouseLeave={(e) => !isVideoCategory && e.currentTarget.pause()}
                                        />
                                    ) : (
                                        <img
                                            src={coverMedia.file_url}
                                            alt={project.title}
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    )
                                ) : (
                                    <div className="w-full aspect-square bg-neutral-800 flex items-center justify-center">
                                        <span className="text-gray-500 text-sm">No Media</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                    <h3 className="text-2xl font-bold uppercase tracking-wide text-white mb-2">{project.title}</h3>
                                    <p className="text-gray-300 text-sm">{project.client}</p>
                                </div>
                            </div>
                        );

                        if (isVideoCategory) {
                            return (
                                <div
                                    key={project.id}
                                    className={sharedCardClass}
                                    onClick={() => coverMedia && setOverlayVideo({ url: coverMedia.file_url, title: project.title })}
                                    onMouseEnter={() => { setCursorText('PLAY'); setCursorVariant('project'); }}
                                    onMouseLeave={() => { setCursorText(''); setCursorVariant('default'); }}
                                >
                                    {cardInner}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={project.id}
                                href={`/portfolio/${project.slug}`}
                                className={sharedCardClass}
                                onMouseEnter={() => { setCursorText(coverMedia?.media_type === 'video' ? 'PLAY' : 'VIEW'); setCursorVariant('project'); }}
                                onMouseLeave={() => { setCursorText(''); setCursorVariant('default'); }}
                            >
                                {cardInner}
                            </Link>
                        );
                    })}
                </div>
            )}

            {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-32 text-gray-500">
                    <p>No projects found in this category.</p>
                </div>
            )}

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
