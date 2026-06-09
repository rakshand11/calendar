"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifySignupContent() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const router = useRouter();

    async function handleVerify() {
        if (!otp) {
            setError("Please enter the OTP");
            return;
        }

        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/verify-signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Something went wrong");
            setLoading(false);
            return;
        }

        // account verified → go to signin
        router.push("/auth/signin?verified=true");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify your email</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Enter the 6-digit code sent to <span className="font-medium text-gray-700">{email}</span>
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none focus:border-black text-center text-2xl tracking-widest text-gray-900"
                />

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full bg-black text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify Account"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already verified?{" "}
                    <Link href="/auth/signin" className="text-black font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function VerifySignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifySignupContent />
        </Suspense>
    );
}