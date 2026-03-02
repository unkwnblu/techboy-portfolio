import { login } from "../actions";
import { Lock } from "lucide-react";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.04),transparent)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Logo */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <a href="/" className="flex items-center gap-2 group">
                    <img src="/logo.svg" alt="Techboy" className="h-8 w-auto opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm px-6 relative z-10">
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 backdrop-blur-sm shadow-2xl shadow-black/50">
                    {/* Icon */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-center mb-4">
                            <Lock className="w-5 h-5 text-white/50" />
                        </div>
                        <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-white">Admin Access</h1>
                        <p className="text-white/25 text-xs tracking-widest uppercase mt-1">Techboy Studio</p>
                    </div>

                    <form action={login} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-white/35 uppercase tracking-[0.18em] mb-2">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors"
                                placeholder="admin@techboy.studio"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-white/35 uppercase tracking-[0.18em] mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                className="w-full bg-black/40 border border-white/[0.08] rounded-xl py-3 px-4 text-white text-sm placeholder-white/15 focus:outline-none focus:border-white/25 transition-colors"
                                placeholder="••••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                <p className="text-red-400 text-xs text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 active:bg-white/80 transition-colors uppercase tracking-[0.15em] text-sm mt-2"
                        >
                            Sign In
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/15 text-xs mt-6 tracking-widest uppercase">
                    © {new Date().getFullYear()} Techboy Studio
                </p>
            </div>
        </div>
    );
}
