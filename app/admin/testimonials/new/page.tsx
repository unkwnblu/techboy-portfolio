"use client";

import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { addTestimonial } from "../actions";
import { useState } from "react";

export default function NewTestimonialPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await addTestimonial(formData);
            if (res?.error) {
                // Check if it's the specific "relation does not exist" error
                if (res.error.includes("relation") && res.error.includes("does not exist")) {
                    setError("The 'testimonials' database table doesn't exist yet! Please run the SQL migration command provided in the chat.");
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
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/testimonials" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">New Testimonial</h1>
                    <p className="text-gray-400">Add a new client review to display publicly.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Client Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Client Role or Company (Optional)</label>
                        <input
                            type="text"
                            name="role"
                            placeholder="e.g. CEO at Acme Corp"
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Rating (1-5)</label>
                    <input
                        type="number"
                        name="rating"
                        min="1"
                        max="5"
                        defaultValue="5"
                        required
                        className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Review Content</label>
                    <textarea
                        name="content"
                        rows={4}
                        required
                        className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-500 transition-colors resize-none"
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <p className="text-red-400 text-sm whitespace-pre-wrap">{error}</p>
                    </div>
                )}

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {loading ? 'Saving...' : 'Save Testimonial'}
                    </button>
                </div>
            </form>
        </div>
    );
}
