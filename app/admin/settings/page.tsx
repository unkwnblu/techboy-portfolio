"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, User, Lock, Mail } from "lucide-react";

export default function SettingsPage() {
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [nameLoading, setNameLoading] = useState(false);
    const [nameSuccess, setNameSuccess] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwLoading, setPwLoading] = useState(false);
    const [pwSuccess, setPwSuccess] = useState(false);
    const [pwError, setPwError] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setEmail(user.email ?? "");
                setDisplayName(user.user_metadata?.full_name ?? "");
            }
        });
    }, []);

    async function handleNameSave(e: React.FormEvent) {
        e.preventDefault();
        setNameLoading(true);
        setNameError(null);
        setNameSuccess(false);

        const { error } = await supabase.auth.updateUser({
            data: { full_name: displayName },
        });

        setNameLoading(false);
        if (error) {
            setNameError(error.message);
        } else {
            setNameSuccess(true);
            setTimeout(() => setNameSuccess(false), 3000);
        }
    }

    async function handlePasswordChange(e: React.FormEvent) {
        e.preventDefault();
        setPwError(null);
        setPwSuccess(false);

        if (newPassword !== confirmPassword) {
            setPwError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setPwError("Password must be at least 8 characters.");
            return;
        }

        setPwLoading(true);

        // Re-authenticate with current password first
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: currentPassword,
        });

        if (signInError) {
            setPwLoading(false);
            setPwError("Current password is incorrect.");
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        setPwLoading(false);
        if (error) {
            setPwError(error.message);
        } else {
            setPwSuccess(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => setPwSuccess(false), 4000);
        }
    }

    return (
        <div className="space-y-10 max-w-2xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-white/30 text-sm mt-1">Manage your profile and security preferences.</p>
            </div>

            {/* Profile Section */}
            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-2.5">
                    <User className="w-4 h-4 text-white/40" />
                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-white/60">
                        Profile
                    </h2>
                </div>

                <form onSubmit={handleNameSave} className="p-6 space-y-5">
                    {/* Email (read-only) */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 flex items-center gap-1.5">
                            <Mail className="w-3 h-3" />
                            Email Address
                        </label>
                        <input
                            type="text"
                            value={email}
                            disabled
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white/40 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-white/20 mt-1.5">Email cannot be changed from this panel.</p>
                    </div>

                    {/* Display Name */}
                    <div>
                        <label htmlFor="displayName" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">
                            Display Name
                        </label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="e.g. Seun"
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                        />
                        <p className="text-[10px] text-white/20 mt-1.5">This name is shown in the dashboard greeting.</p>
                    </div>

                    {nameError && (
                        <p className="text-red-400 text-xs">{nameError}</p>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={nameLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[12px] font-bold uppercase tracking-wider rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {nameLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : null}
                            Save Profile
                        </button>
                        {nameSuccess && (
                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Saved
                            </span>
                        )}
                    </div>
                </form>
            </section>

            {/* Password Section */}
            <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.05] flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-white/40" />
                    <h2 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-white/60">
                        Change Password
                    </h2>
                </div>

                <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
                    <div>
                        <label htmlFor="currentPassword" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">
                            Current Password
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                        />
                    </div>

                    {pwError && (
                        <p className="text-red-400 text-xs">{pwError}</p>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={pwLoading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[12px] font-bold uppercase tracking-wider rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {pwLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : null}
                            Update Password
                        </button>
                        {pwSuccess && (
                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Password updated
                            </span>
                        )}
                    </div>
                </form>
            </section>
        </div>
    );
}
