"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    async function handleSubmit() {

        await fetch("/api/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        router.push(`/auth/verify?email=${email}`);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-2">Sign in</h1>
                <p className="text-gray-500 mb-6">Enter your email to get a code</p>

                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none focus:border-black"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-black text-white rounded-lg px-4 py-3 font-medium hover:bg-gray-800"
                >
                    Send OTP
                </button>
            </div>
        </div>
    );
}