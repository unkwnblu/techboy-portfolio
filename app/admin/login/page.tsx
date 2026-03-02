import { login } from "@/app/(admin)/auth/actions";
import { Lock } from "lucide-react";

export default function LoginPage({
    searchParams,
}: {
    searchParams: { error?: string };
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-grid-white/[0.02]">
            <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl relative overflow-hidden">

                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="mx-auto w-12 h-12 bg-white/10 flex items-center justify-center rounded-full mb-4 border border-white/20">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-white">Admin Access</h1>
                    <p className="text-gray-400 mt-2 text-sm uppercase tracking-wider">Authorized Personnel Only</p>
                </div>

                <form action={login} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full bg-black/50 border border-neutral-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {searchParams?.error && (
                        <p className="text-red-500 text-sm">{searchParams.error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
