import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendOTPEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const client = await clientPromise;
        const db = client.db();

        await db.collection("otps").deleteMany({ email });

        await db.collection("otps").insertOne({
            email,
            otp,
            createdAt: new Date(),
        });

        await sendOTPEmail(email, otp);

        return NextResponse.json({ message: "OTP sent!" });

    } catch (error) {
        console.error("SEND OTP ERROR:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}