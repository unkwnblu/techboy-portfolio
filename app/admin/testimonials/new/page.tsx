"use client";

import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { addTestimonial } from "../actions";
import { useState } from "react";

export default function NewTestimonialPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await addTestimonial(formData);
            if (res?.error) {
                if (res.error.includes("relation") && res.error.includes("does not exist")) {
                    setError(
                        "The 'testimonials' database table doesn't exist yet! Please run the SQL migration."
                    );
                } else {
                    setError(res.error);
                }
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/testimonials"
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors text-white/50 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 mb-0.5">
                        Testimonials
                    </p>
                    <h1 className="text-xl font-bold tracking-tight">New Review</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-5">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        Client Info
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                                Client Name <span className="text-red-400/80">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors"
                                placeholder="e.g. Tunde Adeyemi"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                                Role / Company{" "}
                                <span className="text-white/20 normal-case tracking-normal text-[9px]">
                                    (optional)
                                </span>
                            </label>
                            <input
                                type="text"
                                name="role"
                                placeholder="e.g. CEO at Acme Corp"
                                className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Star rating picker */}
                    <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-3">
                            Rating
                        </label>
                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setRating(i + 1)}
                                    onMouseEnter={() => setHoverRating(i + 1)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <svg
                                        className={`w-6 h-6 transition-colors ${
                                            i < (hoverRating || rating)
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-white/10 fill-white/10"
                                        }`}
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                            <span className="text-[11px] text-white/30 ml-2">{rating}/5</span>
                        </div>
                        <input type="hidden" name="rating" value={rating} />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2">
                            Review <span className="text-red-400/80">*</span>
                        </label>
                        <textarea
                            name="content"
                            rows={4}
                            required
                            className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors resize-none"
                            placeholder="What did they say about working with you?"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/[0.07] border border-red-500/20 rounded-xl px-4 py-3">
                        <p className="text-red-400 text-sm whitespace-pre-wrap">{error}</p>
                    </div>
                )}

                <div className="flex items-center justify-end pt-1">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-[12px] uppercase tracking-wider hover:bg-white/90 transition-colors disabled:opacity-40"
                    >
                        {loading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        {loading ? "Saving…" : "Save Review"}
                    </button>
                </div>
            </form>
        </div>
    );
}
