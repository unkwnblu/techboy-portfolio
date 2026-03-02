"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useCursor } from "@/components/CursorContext";
import Link from "next/link";

type Project = Database['public']['Tables']['projects']['Row'] & {
    media: Database['public']['Tables']['media']['Row'][];
};

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filter, setFilter] = useState<'all' | 'photo' | 'video' | 'drone' | 'edit'>('all');
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const { setCursorText, setCursorVariant } = useCursor();

    useEffect(() => {
        async function fetchProjects() {
            const { data, error } = await supabase
                .from('projects')
                .select(`
          *,
          media (*)
        `)
                .order('created_at', { ascending: false });

            if (data) {
                setProjects(data as unknown as Project[]);
            }
            setLoading(false);
        }

        fetchProjects();
    }, [supabase]);

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
        { label: 'Photography', value: 'photo' },
        { label: 'Videography', value: 'video' },
        { label: 'Drone', value: 'drone' },
        { label: 'Editing', value: 'edit' },
    ] as const;

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
                        const coverMedia = project.media?.[0]; // Assume first media is cover
                        return (
                            <Link href={`/portfolio/${project.slug}`} key={project.id} className="block cursor-none group relative rounded-xl overflow-hidden break-inside-avoid shadow-2xl bg-neutral-900"
                                onMouseEnter={() => {
                                    setCursorText(coverMedia?.media_type === 'video' ? 'PLAY' : 'VIEW');
                                    setCursorVariant('project');
                                }}
                                onMouseLeave={() => {
                                    setCursorText('');
                                    setCursorVariant('default');
                                }}>
                                <div className="portfolio-item pointer-events-none">
                                    {coverMedia ? (
                                        coverMedia.media_type === 'video' ? (
                                            <video
                                                src={coverMedia.file_url}
                                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                muted loop playsInline
                                                onMouseEnter={(e) => e.currentTarget.play()}
                                                onMouseLeave={(e) => e.currentTarget.pause()}
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
        </div>
    );
}
