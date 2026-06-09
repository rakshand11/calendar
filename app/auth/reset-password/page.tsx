"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordContent() {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const router = useRouter();

    async function handleReset() {
        if (!otp || !newPassword || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, newPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Something went wrong");
            setLoading(false);
            return;
        }

        // password reset → go to signin
        router.push("/auth/signin?reset=true");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset password</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Enter the code sent to <span className="font-medium text-gray-700">{email}</span> and your new password
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">OTP Code</label>
                        <input
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black text-center tracking-widest text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">New Password</label>
                        <input
                            type="password"
                            placeholder="Min 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Repeat new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black text-gray-900"
                        />
                    </div>
                </div>

                <button
                    onClick={handleReset}
                    disabled={loading}
                    className="w-full bg-black text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-800 mt-4 disabled:opacity-50"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Remember your password?{" "}
                    <Link href="/auth/signin" className="text-black font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}