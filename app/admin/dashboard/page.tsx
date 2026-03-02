import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
    FolderOpen,
    ImageIcon,
    MessageSquareQuote,
    Inbox,
    Plus,
    ArrowRight,
    Video,
    Navigation2,
    Camera,
    Film,
    Layers,
    Star,
} from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const [
        { count: projectsCount },
        { count: mediaCount },
        { count: inquiriesCount },
        { count: testimonialsCount },
        { data: recentProjects },
    ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("media").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "unread"),
        supabase.from("testimonials").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*, media(*)").order("created_at", { ascending: false }).limit(6),
    ]);

    const stats = [
        {
            label: "Projects",
            value: projectsCount ?? 0,
            icon: FolderOpen,
            href: "/admin/videography",
            accent: "rgba(99,102,241,0.15)",
            iconColor: "text-indigo-400",
        },
        {
            label: "Media Files",
            value: mediaCount ?? 0,
            icon: ImageIcon,
            href: "/admin/videography",
            accent: "rgba(168,85,247,0.12)",
            iconColor: "text-purple-400",
        },
        {
            label: "Testimonials",
            value: testimonialsCount ?? 0,
            icon: MessageSquareQuote,
            href: "/admin/testimonials",
            accent: "rgba(52,211,153,0.12)",
            iconColor: "text-emerald-400",
        },
        {
            label: "New Inquiries",
            value: inquiriesCount ?? 0,
            icon: Inbox,
            href: "/admin/inquiries",
            accent: (inquiriesCount ?? 0) > 0 ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.03)",
            iconColor: (inquiriesCount ?? 0) > 0 ? "text-amber-400" : "text-white/30",
            highlight: (inquiriesCount ?? 0) > 0,
        },
    ];

    const categories = [
        { label: "Videography", href: "/admin/videography", icon: Video },
        { label: "Drone Pilot", href: "/admin/drone-pilot", icon: Navigation2 },
        { label: "Photography", href: "/admin/photography", icon: Camera },
        { label: "Video Editor", href: "/admin/video-editor", icon: Film },
        { label: "Motion Graphics", href: "/admin/motion-graphics", icon: Layers },
    ];

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    })();

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-1">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {greeting},{" "}
                        <span className="text-white/40">Seun</span>
                    </h1>
                </div>
                <Link
                    href="/admin/videography/new"
                    className="hidden md:flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-white/90 transition-colors flex-shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    New Project
                </Link>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="group relative rounded-2xl border border-white/[0.06] p-5 overflow-hidden hover:border-white/10 transition-all"
                        style={{ background: stat.accent }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            {stat.highlight && (
                                <span className="text-[9px] font-bold uppercase tracking-wide text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                                    New
                                </span>
                            )}
                        </div>
                        <p className="text-3xl font-bold tracking-tight mb-0.5">{stat.value}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.18em]">{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Two-column lower section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Recent Projects */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
                            Recent Projects
                        </h2>
                        <Link
                            href="/admin/videography"
                            className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                        >
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {recentProjects && recentProjects.length > 0 ? (
                        <div className="space-y-2">
                            {recentProjects.map((project) => {
                                const thumb = project.media?.[0];
                                const categorySlug = project.category.replace(/\s+/g, "-");
                                return (
                                    <Link
                                        key={project.id}
                                        href={`/admin/${categorySlug}/${project.id}`}
                                        className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all"
                                    >
                                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0 flex items-center justify-center">
                                            {thumb ? (
                                                thumb.media_type === "image" ? (
                                                    <img
                                                        src={thumb.file_url}
                                                        className="w-full h-full object-cover"
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
                                                <FolderOpen className="w-4 h-4 text-white/15" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors truncate">
                                                {project.title}
                                            </p>
                                            <p className="text-[10px] text-white/25 uppercase tracking-wide mt-0.5">
                                                {project.category} &middot; {project.media?.length ?? 0} files
                                            </p>
                                        </div>
                                        {project.is_featured && (
                                            <Star className="w-3.5 h-3.5 text-amber-400/60 fill-amber-400/40 flex-shrink-0" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 border border-white/[0.04] rounded-2xl">
                            <FolderOpen className="w-8 h-8 text-white/10 mb-3" />
                            <p className="text-white/25 text-sm">No projects yet</p>
                            <Link
                                href="/admin/videography/new"
                                className="mt-4 text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                            >
                                Create your first →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
                        Portfolio Sections
                    </h2>
                    <div className="flex flex-col gap-1.5">
                        {categories.map((cat) => (
                            <Link
                                key={cat.href}
                                href={cat.href}
                                className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all"
                            >
                                <span className="flex items-center gap-3">
                                    <cat.icon className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
                                    <span className="text-[13px] font-medium text-white/50 group-hover:text-white/90 transition-colors">
                                        {cat.label}
                                    </span>
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}

                        {/* Add links to content management */}
                        <div className="mt-2 pt-2 border-t border-white/[0.04] flex flex-col gap-1.5">
                            <Link
                                href="/admin/testimonials/new"
                                className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all"
                            >
                                <span className="flex items-center gap-3">
                                    <Plus className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
                                    <span className="text-[13px] font-medium text-white/50 group-hover:text-white/90 transition-colors">
                                        Add Testimonial
                                    </span>
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                            <Link
                                href="/admin/inquiries"
                                className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all"
                            >
                                <span className="flex items-center gap-3">
                                    <Inbox className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
                                    <span className="text-[13px] font-medium text-white/50 group-hover:text-white/90 transition-colors">
                                        View Inquiries
                                    </span>
                                </span>
                                {(inquiriesCount ?? 0) > 0 && (
                                    <span className="text-[9px] font-bold bg-white text-black w-4 h-4 rounded-full flex items-center justify-center">
                                        {inquiriesCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
