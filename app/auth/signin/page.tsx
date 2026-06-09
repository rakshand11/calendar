"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInContent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const verified = searchParams.get("verified");
    const reset = searchParams.get("reset");

    async function handleSignIn() {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password");
            setLoading(false);
            return;
        }

        window.location.href = "/dashboard";
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
                <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

                {verified && (
                    <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
                        Account verified! You can now sign in.
                    </div>
                )}

                {reset && (
                    <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
                        Password reset successful! You can now sign in.
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black text-gray-900"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-1">
                    <Link href="/auth/forgot-password" className="text-sm text-gray-500 hover:text-black">
                        Forgot password?
                    </Link>
                </div>

                <button
                    onClick={handleSignIn}
                    disabled={loading}
                    className="w-full bg-black text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-800 mt-4 disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Dont have an account?{" "}
                    <Link href="/auth/signup" className="text-black font-medium hover:underline">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SignInContent />
        </Suspense>
    );
}