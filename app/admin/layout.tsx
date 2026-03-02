import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LayoutDashboard, Image as ImageIcon, MessageSquare, LogOut, MessageSquareQuote } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-neutral-950 text-white font-sans">
            <aside className="w-64 bg-black border-r border-gray-900 flex flex-col p-6">
                <h2 className="text-xl font-bold uppercase tracking-widest mb-12">Admin Panel</h2>

                <nav className="flex-1 space-y-4">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-gray-400 font-medium px-2 uppercase tracking-widest text-xs mt-4">
                            <ImageIcon className="w-4 h-4" />
                            <span>Media Portfolios</span>
                        </div>
                        <div className="pl-6 flex flex-col gap-2 mt-2">
                            <Link href="/admin/videography" className="text-gray-500 hover:text-white text-sm transition-colors">Videography</Link>
                            <Link href="/admin/drone-pilot" className="text-gray-500 hover:text-white text-sm transition-colors">Drone Pilot</Link>
                            <Link href="/admin/photography" className="text-gray-500 hover:text-white text-sm transition-colors">Photography</Link>
                            <Link href="/admin/video-editor" className="text-gray-500 hover:text-white text-sm transition-colors">Video Editor</Link>
                            <Link href="/admin/motion-graphics" className="text-gray-500 hover:text-white text-sm transition-colors">Motion Graphics</Link>
                        </div>
                    </div>
                    <Link href="/admin/testimonials" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                        <MessageSquareQuote className="w-5 h-5" />
                        <span>Testimonials</span>
                    </Link>
                    <Link href="/admin/inquiries" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span>Inquiries</span>
                    </Link>
                </nav>

                <form action="/auth/signout" method="post">
                    <button type="submit" className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors w-full text-left">
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </form>
            </aside>

            <main className="flex-1 overflow-y-auto p-12 bg-neutral-950">
                {children}
            </main>
        </div>
    );
}
