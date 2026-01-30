"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const { user, signInWithGoogle, signInWithEmail, loading, error } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInternalError(null);
        try {
            await signInWithEmail(email, password);
        } catch (err: any) {
            // Error is handled in context, but we can also set local error state if needed for specific UI feedback
            if (err.code === 'auth/invalid-credential') {
                setInternalError("Invalid email or password.");
            } else {
                setInternalError("Failed to log in. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#2D1B69]">
                <div className="w-8 h-8 border-4 border-[#9F7AEA] rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    if (user) return null;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#2D1B69] p-4 text-white">
            <div className="w-full max-w-md space-y-8 bg-[#382079] p-8 rounded-3xl shadow-2xl border border-white/5">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Log in</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-[#4A2F8C] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9F7AEA] placeholder-gray-400 text-white transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#4A2F8C] border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9F7AEA] placeholder-gray-400 text-white transition-all pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {(error || internalError) && (
                        <div className="p-3 text-sm text-red-200 bg-red-900/50 rounded-lg">
                            {internalError || error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3.5 text-white bg-[#9F7AEA] hover:bg-[#805AD5] rounded-xl font-semibold shadow-lg shadow-purple-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#D6BCFA] focus:ring-offset-2 focus:ring-offset-[#2D1B69]"
                    >
                        Log in
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-[#382079] text-gray-400">Or Login with</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={signInWithGoogle}
                        className="flex items-center justify-center w-full px-4 py-3 space-x-3 text-white transition-all bg-[#4A2F8C] hover:bg-[#553C9A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9F7AEA] focus:ring-offset-2 focus:ring-offset-[#2D1B69]"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="font-medium">Log in with Google</span>
                    </button>
                    {/* Placeholder for Facebook if needed later
                    <button className="flex items-center justify-center w-full px-4 py-3 space-x-3 text-white transition-all bg-[#4A2F8C] hover:bg-[#553C9A] rounded-xl">
                        <Facebook className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Log in with Facebook</span>
                    </button>
                    */}
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-semibold text-[#9F7AEA] hover:text-[#B794F4] transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
