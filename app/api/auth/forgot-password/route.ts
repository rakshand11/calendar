import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendOTPEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();


        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "No account found with this email" }, { status: 400 });
        }


        const otp = Math.floor(100000 + Math.random() * 900000).toString();


        await db.collection("otps").deleteMany({ email, type: "reset" });


        await db.collection("otps").insertOne({
            email,
            otp,
            type: "reset",
            createdAt: new Date(),
        });


        await sendOTPEmail(email, otp);

        return NextResponse.json({ message: "OTP sent!" });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}