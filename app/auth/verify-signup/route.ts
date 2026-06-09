import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();


        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const record = await db.collection("otps").findOne({
            email,
            otp,
            type: "signup",
            createdAt: { $gt: tenMinutesAgo },
        });

        if (!record) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }


        await db.collection("users").updateOne(
            { email },
            { $set: { verified: true } }
        );


        await db.collection("otps").deleteOne({ _id: record._id });

        return NextResponse.json({ message: "Account verified!" });
    } catch (error) {
        console.error("VERIFY SIGNUP ERROR:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}