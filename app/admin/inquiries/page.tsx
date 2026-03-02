import { createClient } from "@/lib/supabase/server";
import { markAsRead, deleteInquiry } from "./actions";
import { MailOpen, Trash2 } from "lucide-react";

export default async function InquiriesPage() {
    const supabase = await createClient();

    const { data: inquiries } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Inquiries</h1>
                <p className="text-gray-400">Manage messages from your contact form.</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                {inquiries && inquiries.length > 0 ? (
                    <div className="divide-y divide-neutral-800">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className={`p-6 transition-colors ${inquiry.status === "unread" ? "bg-white/5" : ""}`}>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                                            {inquiry.status === "unread" && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white text-black">New</span>
                                            )}
                                        </div>
                                        <a href={`mailto:${inquiry.email}`} className="text-sm text-gray-400 hover:text-white transition-colors">{inquiry.email}</a>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(inquiry.created_at!).toLocaleString()}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        {inquiry.status === "unread" && (
                                            <form action={markAsRead}>
                                                <input type="hidden" name="id" value={inquiry.id} />
                                                <button type="submit" title="Mark as Read" className="p-2 text-gray-400 hover:text-white transition-colors">
                                                    <MailOpen className="w-5 h-5" />
                                                </button>
                                            </form>
                                        )}
                                        <form action={deleteInquiry}>
                                            <input type="hidden" name="id" value={inquiry.id} />
                                            <button type="submit" title="Delete Inquiry" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-black/40 rounded-lg text-gray-300 whitespace-pre-wrap">
                                    {inquiry.message}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <MailOpen className="w-12 h-12 mb-4 opacity-20" />
                        <p>No inquiries yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
