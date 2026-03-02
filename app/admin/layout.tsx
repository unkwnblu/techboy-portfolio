import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
    LayoutDashboard,
    Video,
    Navigation2,
    Camera,
    Film,
    Layers,
    MessageSquareQuote,
    Inbox,
    LogOut,
    ExternalLink,
    Settings,
} from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch unread inquiry count for badge
    const { count: unreadCount } = await supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

    const portfolioLinks = [
        { href: "/admin/videography", icon: Video, label: "Videography" },
        { href: "/admin/drone-pilot", icon: Navigation2, label: "Drone Pilot" },
        { href: "/admin/photography", icon: Camera, label: "Photography" },
        { href: "/admin/video-editor", icon: Film, label: "Video Editor" },
        { href: "/admin/motion-graphics", icon: Layers, label: "Motion Graphics" },
    ];

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
            {/* ─── Sidebar ─── */}
            <aside className="w-[220px] flex-shrink-0 flex flex-col bg-black border-r border-white/[0.05] relative overflow-hidden">
                {/* Top glow accent */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Logo */}
                <div className="relative px-5 py-5 border-b border-white/[0.05]">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        <img
                            src="/logo.svg"
                            alt="Techboy"
                            className="h-9 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="leading-none">
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30 block">
                                Studio
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/20 block mt-0.5">
                                Admin
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-5 px-3 flex flex-col gap-5 overflow-y-auto">
                    {/* Overview */}
                    <div>
                        <p className="text-[8.5px] font-bold uppercase tracking-[0.22em] text-white/20 px-3 mb-1.5">
                            Overview
                        </p>
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all text-[13px] font-medium"
                        >
                            <LayoutDashboard className="w-3.5 h-3.5 flex-shrink-0" />
                            Dashboard
                        </Link>
                    </div>

                    {/* Portfolio */}
                    <div>
                        <p className="text-[8.5px] font-bold uppercase tracking-[0.22em] text-white/20 px-3 mb-1.5">
                            Portfolio
                        </p>
                        <div className="flex flex-col gap-0.5">
                            {portfolioLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all text-[13px] font-medium"
                                >
                                    <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <p className="text-[8.5px] font-bold uppercase tracking-[0.22em] text-white/20 px-3 mb-1.5">
                            Content
                        </p>
                        <div className="flex flex-col gap-0.5">
                            <Link
                                href="/admin/testimonials"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all text-[13px] font-medium"
                            >
                                <MessageSquareQuote className="w-3.5 h-3.5 flex-shrink-0" />
                                Testimonials
                            </Link>
                            <Link
                                href="/admin/inquiries"
                                className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all text-[13px] font-medium"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Inbox className="w-3.5 h-3.5 flex-shrink-0" />
                                    Inquiries
                                </span>
                                {(unreadCount ?? 0) > 0 && (
                                    <span className="text-[9px] font-bold bg-white text-black w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Footer */}
                <div className="border-t border-white/[0.05] p-3">
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all text-[13px] font-medium mb-0.5"
                    >
                        <Settings className="w-3.5 h-3.5 flex-shrink-0" />
                        Settings
                    </Link>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all text-[12px] mb-0.5"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Site
                    </a>
                    <div className="px-3 py-1.5 mb-1">
                        <p className="text-[10px] text-white/20 truncate">{user.email}</p>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/[0.05] transition-all text-[13px] font-medium"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* ─── Main content ─── */}
            <main
                className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                data-lenis-prevent
            >
                {/* Top bar */}
                <div className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.04] px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-white/20 uppercase tracking-widest font-medium">
                        <span>Techboy Studio</span>
                        <span>·</span>
                        <span>Admin Portal</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500/60 shadow-[0_0_6px_rgba(74,222,128,0.5)]" title="Connected" />
                </div>

                <div className="p-8 lg:p-10 max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
