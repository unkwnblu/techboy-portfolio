import { createClient } from "@/lib/supabase/server";
import { markAsRead, deleteInquiry } from "./actions";
import { MailOpen, Trash2, Mail, Inbox } from "lucide-react";

export default async function InquiriesPage() {
    const supabase = await createClient();

    const { data: inquiries } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

    const unreadCount = inquiries?.filter((i) => i.status === "unread").length ?? 0;

    return (
        <div className="space-y-8">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-1">
                    Content
                </p>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inquiries</h1>
                <p className="text-white/35 text-sm mt-1">
                    {inquiries?.length ?? 0} total
                    {unreadCount > 0 && (
                        <>
                            {" "}
                            ·{" "}
                            <span className="text-amber-400 font-medium">{unreadCount} unread</span>
                        </>
                    )}
                </p>
            </div>

            {inquiries && inquiries.length > 0 ? (
                <div className="space-y-3">
                    {inquiries.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            className={`group rounded-2xl border transition-all ${
                                inquiry.status === "unread"
                                    ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/30"
                                    : "bg-white/[0.015] border-white/[0.05] hover:border-white/[0.09]"
                            }`}
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div
                                            className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5 ${
                                                inquiry.status === "unread"
                                                    ? "bg-amber-500/10"
                                                    : "bg-white/[0.04]"
                                            }`}
                                        >
                                            {inquiry.status === "unread" ? (
                                                <Mail className="w-4 h-4 text-amber-400" />
                                            ) : (
                                                <MailOpen className="w-4 h-4 text-white/25" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-semibold text-white/90 text-sm">
                                                    {inquiry.name}
                                                </h3>
                                                {inquiry.status === "unread" && (
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <a
                                                href={`mailto:${inquiry.email}`}
                                                className="text-[12px] text-white/35 hover:text-white/60 transition-colors block truncate"
                                            >
                                                {inquiry.email}
                                            </a>
                                            <p className="text-[10px] text-white/20 mt-0.5">
                                                {new Date(inquiry.created_at!).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 flex-shrink-0">
                                        {inquiry.status === "unread" && (
                                            <form action={markAsRead}>
                                                <input type="hidden" name="id" value={inquiry.id} />
                                                <button
                                                    type="submit"
                                                    title="Mark as read"
                                                    className="p-2 text-white/25 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                                                >
                                                    <MailOpen className="w-4 h-4" />
                                                </button>
                                            </form>
                                        )}
                                        <form action={deleteInquiry}>
                                            <input type="hidden" name="id" value={inquiry.id} />
                                            <button
                                                type="submit"
                                                title="Delete"
                                                className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/[0.05] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="mt-4 ml-13 p-4 bg-black/30 rounded-xl border border-white/[0.04] text-white/45 text-sm leading-relaxed whitespace-pre-wrap">
                                    {inquiry.message}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-28 border border-white/[0.04] rounded-2xl text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                        <Inbox className="w-7 h-7 text-white/15" />
                    </div>
                    <p className="text-white/35 text-sm mb-1">No inquiries yet</p>
                    <p className="text-white/20 text-xs">Contact form submissions will appear here</p>
                </div>
            )}
        </div>
    );
}
