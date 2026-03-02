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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Client Testimonials</h1>
                    <p className="text-gray-400">Manage feedback from your clients to build trust.</p>
                </div>
                <Link
                    href="/admin/testimonials/new"
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
                >
                    <Plus className="w-4 h-4" />
                    New Testimonial
                </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                {testimonials && testimonials.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-widest border-b border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">Client Info</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Rating</th>
                                <th className="px-6 py-4 font-medium hidden lg:table-cell">Review Snippet</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {testimonials.map((t) => (
                                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                                                <UserCircle2 className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white truncate">{t.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{t.role || 'Client'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < (t.rating || 5) ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-700'}`} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell text-gray-400 text-sm italic max-w-xs truncate">
                                        "{t.content}"
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <form action={deleteTestimonial}>
                                            <input type="hidden" name="id" value={t.id} />
                                            <button type="submit" title="Delete Testimonial" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <MessageSquareQuote className="w-12 h-12 mb-4 opacity-20" />
                        <p>No testimonials found. Add your first client review to display on the site.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
