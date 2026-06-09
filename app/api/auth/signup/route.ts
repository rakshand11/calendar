import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();


        const existing = await db.collection("users").findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        await db.collection("users").insertOne({
            email,
            password: hashedPassword,
            verified: false,
            createdAt: new Date(),
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();


        await db.collection("otps").deleteMany({ email });


        await db.collection("otps").insertOne({
            email,
            otp,
            type: "signup",
            createdAt: new Date(),
        });


        await sendOTPEmail(email, otp);

        return NextResponse.json({ message: "OTP sent!" });
    } catch (error) {
        console.error("SIGNUP ERROR:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}