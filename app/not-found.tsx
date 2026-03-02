import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">
            {/* Ambient radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(255,255,255,0.025),transparent)]" />

            {/* Top line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Logo */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <Link href="/">
                    <img src="/logo.svg" alt="Techboy" className="h-7 w-auto opacity-40 hover:opacity-70 transition-opacity" />
                </Link>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center select-none">
                {/* Giant stroke 404 */}
                <h1
                    className="font-bold leading-none tracking-tighter pointer-events-none"
                    style={{
                        fontSize: "clamp(8rem, 28vw, 22rem)",
                        color: "transparent",
                        WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                        lineHeight: 1,
                    }}
                >
                    404
                </h1>

                {/* Content below the 404 */}
                <div className="-mt-4 md:-mt-8 relative">
                    <div className="w-16 h-px bg-white/20 mx-auto mb-6" />
                    <p className="text-base md:text-xl font-bold uppercase tracking-[0.3em] text-white/70 mb-3">
                        Frame Not Found
                    </p>
                    <p className="text-white/30 text-sm max-w-sm mx-auto mb-10 font-light leading-relaxed">
                        This scene doesn't exist in the timeline. The page you're looking for has moved or been cut from the edit.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 border border-white/15 hover:border-white/40 text-white/50 hover:text-white/90 px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-white/5"
                    >
                        Return to Portfolio
                    </Link>
                </div>
            </div>

            {/* Film strip bottom decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden opacity-[0.08]">
                <div className="h-full border-t border-white/30 flex">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 border-r border-white/30"
                            style={{ backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'transparent' }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom label */}
            <p className="absolute bottom-4 text-white/15 text-[10px] uppercase tracking-[0.3em]">
                Techboy Studio · Lagos, Nigeria
            </p>
        </div>
    );
}
