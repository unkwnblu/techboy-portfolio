import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60; // ISR

export default async function ProjectDetailsPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: project } = await supabase
        .from("projects")
        .select("*, media(*)")
        .eq("slug", slug)
        .single();

    if (!project) {
        notFound();
    }

    const { media } = project;
    const sortedMedia = media?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [];
    const heroMedia = sortedMedia.length > 0 ? sortedMedia[0] : null;
    const galleryMedia = sortedMedia.slice(1);

    return (
        <div className="min-h-screen bg-black text-white relative">
            <div className="fixed top-24 left-8 z-40 mix-blend-difference hidden md:block">
                <Link href="/portfolio" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-semibold">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Portfolio
                </Link>
            </div>

            {/* Hero Section */}
            <div className="relative w-full h-[70vh] md:h-screen flex flex-col justify-end p-8 md:p-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {heroMedia ? (
                        heroMedia.media_type === 'video' ? (
                            <video
                                src={heroMedia.file_url}
                                autoPlay muted loop playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={heroMedia.file_url}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="w-full h-full bg-neutral-900 border-b border-white/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                </div>

                <div className="relative z-20 max-w-4xl">
                    <div className="flex gap-4 mb-4">
                        <span className="uppercase tracking-widest text-xs font-semibold text-gray-400 border border-gray-600 px-3 py-1 rounded-full">
                            {project.category}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-4">{project.title}</h1>
                    <p className="text-xl md:text-3xl font-light text-gray-300">{project.client}</p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-8 py-20 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4 lg:col-start-2 flex flex-col gap-12">
                    <div>
                        <h3 className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-4">The Brief</h3>
                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                            {project.description || "No description provided for this project."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Client</h3>
                            <p className="font-medium">{project.client || "Independent"}</p>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Category</h3>
                            <p className="font-medium uppercase tracking-wider">{project.category}</p>
                        </div>
                    </div>

                    <Link
                        href="/contact"
                        className="mt-8 inline-block text-center bg-white text-black font-semibold px-8 py-4 uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Start Your Project
                    </Link>
                </div>

                <div className="lg:col-span-6 flex flex-col gap-8">
                    {galleryMedia.map((item: any) => (
                        <div key={item.id} className="w-full rounded-xl overflow-hidden bg-neutral-900">
                            {item.media_type === 'video' ? (
                                <video
                                    src={item.file_url}
                                    controls
                                    className="w-full h-auto object-cover"
                                />
                            ) : (
                                <img
                                    src={item.file_url}
                                    alt="Gallery item"
                                    className="w-full h-auto object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
