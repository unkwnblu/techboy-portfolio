"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createClient } from "@/lib/supabase/client";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ContactFormContent() {
    const container = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const initialCategoryParam = searchParams.get("category");

    // Map URL words to actual exact dropdown values if needed, otherwise use simple fallback
    const matchedCategory = initialCategoryParam ?
        ['photography', 'videography', 'drone', 'editing'].find(c =>
            initialCategoryParam.toLowerCase().includes(c) || c.includes(initialCategoryParam.toLowerCase())
        ) : null;

    const [category, setCategory] = useState(matchedCategory || "general");

    const supabase = createClient();

    useGSAP(() => {
        gsap.fromTo(
            ".contact-element",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power2.out" }
        );
    }, { scope: container });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            category: formData.get("category") as string,
            message: formData.get("message") as string,
        };

        const { error: insertError } = await supabase
            .from("inquiries")
            .insert([data]);

        setLoading(false);

        if (insertError) {
            setError("Failed to send your message. Please try again.");
            console.error(insertError);
        } else {
            setSuccess(true);
            form.reset();
        }
    }

    return (
        <div ref={container} className="w-full max-w-2xl bg-neutral-900/50 p-8 md:p-16 rounded-3xl backdrop-blur-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-white/20 to-gray-800" />

            <h1 className="contact-element text-5xl md:text-6xl font-bold uppercase tracking-tighter mb-4">
                Connect
            </h1>
            <p className="contact-element text-gray-400 font-light text-lg mb-12">
                Have a project in mind? Let's create something extraordinary.
            </p>

            {success ? (
                <div className="contact-element py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h2 className="text-3xl font-bold tracking-tight">Message Sent</h2>
                    <p className="text-gray-400">We will get back to you as soon as possible.</p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="mt-8 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Send Another
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="contact-element">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="contact-element">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="contact-element">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Inquiry Category</label>
                        <select
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:outline-none focus:border-white transition-colors [&>option]:bg-neutral-900"
                        >
                            <option value="general">General Inquiry</option>
                            <option value="photography">Photography</option>
                            <option value="videography">Cinematic Videography</option>
                            <option value="drone">Aerial Drone Piloting</option>
                            <option value="editing">Post-Production & Editing</option>
                        </select>
                    </div>

                    <div className="contact-element">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={4}
                            className="w-full bg-transparent border-b border-gray-700 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"
                            placeholder="Tell me about your project..."
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="contact-element w-full flex flex-wrap items-center justify-center gap-2 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Send Inquiry
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-8 flex items-center justify-center">
            <Suspense fallback={<div className="text-white">Loading form...</div>}>
                <ContactFormContent />
            </Suspense>
        </div>
    );
}
