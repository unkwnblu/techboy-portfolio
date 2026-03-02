import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LayoutDashboard, Image as ImageIcon, MessageSquare, LogOut } from "lucide-react";

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
                    <Link href="/admin/media" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                        <ImageIcon className="w-5 h-5" />
                        <span>Media & Projects</span>
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
