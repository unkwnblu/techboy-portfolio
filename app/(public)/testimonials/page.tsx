"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Loader2, Quote, Star } from "lucide-react";

type Testimonial = {
    id: string;
    name: string;
    role: string | null;
    content: string;
    rating: number | null;
    created_at: string;
};

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchTestimonials() {
            // Attempt to fetch from the new testimonials table
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                setTestimonials(data);
            } else if (error) {
                console.error("Testimonials fetch error (table might not exist yet):", error);
            }
            setLoading(false);
        }

        fetchTestimonials();
    }, [supabase]);

    useGSAP(() => {
        if (!loading) {
            gsap.fromTo(
                ".testimonial-card",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
            );
        }
    }, [loading]);

    return (
        <div className="min-h-screen pt-32 px-8 pb-32 max-w-7xl mx-auto flex flex-col items-center">

            <div className="text-center max-w-2xl mb-24 relative">
                <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6 relative z-10">
                    Client <br /><span className="text-transparent [-webkit-text-stroke:2px_white]">Voices</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
                    The stories behind the frames. Hear directly from the visionaries, brands, and creatives I've had the honor of collaborating with.
                </p>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-[100px] w-64 h-64 rounded-full pointer-events-none -z-10" />
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
                </div>
            ) : testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {testimonials.map((t, idx) => (
                        <div
                            key={t.id}
                            className="testimonial-card relative bg-neutral-900 border border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col group hover:border-white/30 transition-colors duration-500 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                <Quote className="w-24 h-24 rotate-180" />
                            </div>

                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < (t.rating || 5) ? 'text-white fill-white' : 'text-gray-700'}`}
                                    />
                                ))}
                            </div>

                            <div className="flex-1 mb-10 relative z-10">
                                <p className="text-lg md:text-xl font-light text-gray-300 leading-relaxed italic">
                                    "{t.content}"
                                </p>
                            </div>

                            <div className="border-t border-white/10 pt-6 mt-auto">
                                <h3 className="text-lg font-bold uppercase tracking-wide text-white">{t.name}</h3>
                                {t.role && (
                                    <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">{t.role}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed border-white/20 rounded-3xl w-full p-12 text-center bg-white/5">
                    <Quote className="w-16 h-16 text-gray-600 mb-6" />
                    <h3 className="text-2xl font-bold uppercase tracking-widest text-white mb-2">No Testimonials Yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Once the database table is hydrated, client testimonials will appear here in a beautifully rendered grid.
                    </p>
                </div>
            )}
        </div>
    );
}
