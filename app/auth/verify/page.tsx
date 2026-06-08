import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function VerifyContent() {
    const [otp, setOtp] = useState("");
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    async function handleVerify() {
        await signIn("credentials", {
            email,
            otp,
            callbackUrl: "/dashboard",
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                <p className="text-gray-500 mb-6">Enter the 6-digit code we sent to {email}</p>
                <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 outline-none focus:border-black text-center text-2xl tracking-widest"
                />
                <button
                    onClick={handleVerify}
                    className="w-full bg-black text-white rounded-lg px-4 py-3 font-medium hover:bg-gray-800"
                >
                    Verify
                </button>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}