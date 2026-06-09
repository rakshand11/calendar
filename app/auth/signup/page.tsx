"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSignUp() {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Something went wrong");
            setLoading(false);
            return;
        }

        // go to verify page
        router.push(`/auth/verify-signup?email=${encodeURIComponent(email)}`);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
                <p className="text-gray-500 text-sm mb-6">Sign up to get started</p>

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
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black text-gray-900"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="w-full bg-black text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-800 mt-4 disabled:opacity-50"
                >
                    {loading ? "Sending OTP..." : "Create Account"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-black font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}