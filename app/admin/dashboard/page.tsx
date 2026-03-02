import { createClient } from "@/lib/supabase/server";
import { MessageSquare, Image as ImageIcon, Video, FolderGit2 } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch some stats
    const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
    const { count: mediaCount } = await supabase.from('media').select('*', { count: 'exact', head: true });
    const { count: inquiriesCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'unread');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Dashboard</h1>
                <p className="text-gray-400">Overview of your portfolio and recent activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Total Projects</p>
                        <p className="text-3xl font-bold">{projectsCount || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                        <FolderGit2 className="w-6 h-6 text-gray-400" />
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Total Media</p>
                        <p className="text-3xl font-bold">{mediaCount || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between col-span-1 lg:col-span-2">
                    <div>
                        <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Unread Inquiries</p>
                        <p className="text-3xl font-bold">{inquiriesCount || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mt-12">
                <h2 className="text-xl font-bold uppercase tracking-wide mb-6">Recent Activity</h2>
                <p className="text-gray-400 text-sm">You're all caught up. Check inquiries or manage your media.</p>
            </div>
        </div>
    );
}
