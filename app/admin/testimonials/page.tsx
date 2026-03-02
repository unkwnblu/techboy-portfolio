import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Trash2, Star, UserCircle2, MessageSquareQuote } from "lucide-react";
import { deleteTestimonial } from "./actions";

export default async function TestimonialsAdminPage() {
    const supabase = await createClient();

    const { data: testimonials } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-1">
                        Content
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Testimonials</h1>
                    <p className="text-white/35 text-sm mt-1">
                        {testimonials?.length ?? 0} review{(testimonials?.length ?? 0) !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    href="/admin/testimonials/new"
                    className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-white/90 transition-colors flex-shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Review
                </Link>
            </div>

            {testimonials && testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="group relative bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 hover:border-white/[0.09] transition-all"
                        >
                            <form
                                action={deleteTestimonial}
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <input type="hidden" name="id" value={t.id} />
                                <button
                                    type="submit"
                                    title="Delete"
                                    className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/[0.08] rounded-lg transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </form>

                            <div className="flex gap-0.5 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${
                                            i < (t.rating || 5)
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-white/[0.08]"
                                        }`}
                                    />
                                ))}
                            </div>

                            <p className="text-white/50 text-sm leading-relaxed italic mb-5 line-clamp-3">
                                &ldquo;{t.content}&rdquo;
                            </p>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                                <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                                    <UserCircle2 className="w-4 h-4 text-white/25" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white/80 truncate">{t.name}</p>
                                    <p className="text-[10px] text-white/30 truncate">{t.role || "Client"}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-28 border border-white/[0.04] rounded-2xl text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-4">
                        <MessageSquareQuote className="w-7 h-7 text-white/15" />
                    </div>
                    <p className="text-white/35 text-sm mb-1">No testimonials yet</p>
                    <p className="text-white/20 text-xs mb-7">
                        Add client reviews to build credibility on your site
                    </p>
                    <Link
                        href="/admin/testimonials/new"
                        className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add First Review
                    </Link>
                </div>
            )}
        </div>
    );
}
