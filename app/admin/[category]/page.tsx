import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit2, Trash2, FolderOpen, Star } from "lucide-react";
import { deleteProject } from "./actions";
import { notFound } from "next/navigation";

type ProjectCategory =
    | "videography"
    | "drone pilot"
    | "photography"
    | "video editor"
    | "motion graphics";

function getDbCategory(slug: string): ProjectCategory | null {
    const map: Record<string, ProjectCategory> = {
        videography: "videography",
        "drone-pilot": "drone pilot",
        photography: "photography",
        "video-editor": "video editor",
        "motion-graphics": "motion graphics",
    };
    return map[slug] || null;
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const { category } = await params;
    const dbCategory = getDbCategory(category);

    if (!dbCategory) notFound();

    const supabase = await createClient();
    const { data: projects } = await supabase
        .from("projects")
        .select("*, media(*)")
        .eq("category", dbCategory)
        .order("created_at", { ascending: false });

    const displayTitle = dbCategory
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const featuredCount = projects?.filter((p) => p.is_featured).length ?? 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-1">
                        Portfolio
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{displayTitle}</h1>
                    <p className="text-white/35 text-sm mt-1">
                        {projects?.length ?? 0} project{(projects?.length ?? 0) !== 1 ? "s" : ""}
                        {featuredCount > 0 && (
                            <span className="text-white/25"> · {featuredCount} featured</span>
                        )}
                    </p>
                </div>
                <Link
                    href={`/admin/${category}/new`}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-white/90 transition-colors flex-shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    New Project
                </Link>
            </div>

            {/* Projects */}
            {projects && projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projects.map((project) => {
                        const thumb = project.media?.[0];
                        return (
                            <div
                                key={project.id}
                                className="group bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden hover:border-white/[0.10] transition-all"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-44 bg-white/[0.02] overflow-hidden">
                                    {thumb ? (
                                        thumb.media_type === "image" ? (
                                            <img
                                                src={thumb.file_url}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                alt=""
                                            />
                                        ) : (
                                            <video
                                                src={thumb.file_url}
                                                className="w-full h-full object-cover"
                                                muted
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FolderOpen className="w-8 h-8 text-white/10" />
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                        {project.is_featured ? (
                                            <span className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                                                    Featured
                                                </span>
                                            </span>
                                        ) : (
                                            <span />
                                        )}
                                        <span className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-[9px] text-white/50">
                                            {project.media?.length ?? 0} files
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-white/90 truncate text-sm">
                                            {project.title}
                                        </h3>
                                        <p className="text-[10px] text-white/25 mt-0.5 truncate font-mono">
                                            /{project.slug}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] text-white/30 truncate max-w-[120px]">
                                            {project.client || "—"}
                                        </span>
                                        <div className="flex items-center gap-0.5">
                                            <Link
                                                href={`/admin/${category}/${project.id}`}
                                                className="p-2 text-white/25 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Link>
                                            <form action={deleteProject}>
                                                <input type="hidden" name="id" value={project.id} />
                                                <button
                                                    type="submit"
                                                    title="Delete"
                                                    className="p-2 text-white/25 hover:text-red-400 hover:bg-red-500/[0.06] rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-28 border border-white/[0.04] rounded-2xl text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                        <FolderOpen className="w-7 h-7 text-white/15" />
                    </div>
                    <p className="text-white/35 text-sm mb-1">No {displayTitle} projects yet</p>
                    <p className="text-white/20 text-xs mb-7">
                        Upload your first project to populate this section
                    </p>
                    <Link
                        href={`/admin/${category}/new`}
                        className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create First Project
                    </Link>
                </div>
            )}
        </div>
    );
}
