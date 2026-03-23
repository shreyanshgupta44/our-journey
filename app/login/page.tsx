"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [guestLoading, setGuestLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/");
        router.refresh();
    };

    const handleGuestLogin = async () => {
        setError("");
        setGuestLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: "guest@ourjourney.app",
            password: "guestguest123",
        });

        if (error) {
            setError("Guest login unavailable. Please try again later.");
            setGuestLoading(false);
            return;
        }

        router.push("/");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {/* Background pattern */}
            <div className="fixed inset-0 opacity-[0.03]">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #1A1710 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="relative w-full max-w-md animate-fade-in-up">
                {/* Logo */}
                <div className="text-center mb-12">
                    <span className="text-gold text-3xl">✦</span>
                    <h1 className="font-serif text-4xl mt-4 tracking-wide">
                        Our Journey
                    </h1>
                    <p className="text-espresso/40 text-sm mt-3 tracking-wider uppercase">
                        A love story in places
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white/50 border-subtle rounded-2xl p-8 md:p-10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs tracking-wider uppercase text-espresso/50 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-cream border-subtle text-espresso placeholder:text-espresso/25 focus:outline-none focus:border-gold/50 transition-colors font-sans text-sm"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs tracking-wider uppercase text-espresso/50 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-cream border-subtle text-espresso placeholder:text-espresso/25 focus:outline-none focus:border-gold/50 transition-colors font-sans text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center py-2 px-4 rounded-lg bg-red-50/50">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || guestLoading}
                            className="w-full py-3.5 rounded-xl bg-espresso text-cream font-sans text-sm tracking-wider uppercase hover:bg-espresso/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                                    Entering...
                                </span>
                            ) : (
                                "Enter"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-espresso/10" />
                        <span className="text-espresso/25 text-xs tracking-wider uppercase">or</span>
                        <div className="flex-1 h-px bg-espresso/10" />
                    </div>

                    {/* Guest Login */}
                    <button
                        onClick={handleGuestLogin}
                        disabled={loading || guestLoading}
                        className="w-full py-3.5 rounded-xl border border-gold/30 text-espresso/60 font-sans text-sm tracking-wider uppercase hover:bg-gold/5 hover:border-gold/50 hover:text-espresso transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {guestLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                                Loading demo...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View as Guest
                            </span>
                        )}
                    </button>
                    <p className="text-center text-espresso/25 text-[11px] mt-3">
                        Browse the app in read-only mode
                    </p>
                </div>

                <p className="text-center text-espresso/20 text-xs mt-8 tracking-wider">
                    Private — just the two of us
                </p>
            </div>
        </div>
    );
}
