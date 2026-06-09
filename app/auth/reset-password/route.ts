import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: "All fields required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();


        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const record = await db.collection("otps").findOne({
            email,
            otp,
            type: "reset",
            createdAt: { $gt: tenMinutesAgo },
        });

        if (!record) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);


        await db.collection("users").updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );


        await db.collection("otps").deleteOne({ _id: record._id });

        return NextResponse.json({ message: "Password reset successful!" });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}