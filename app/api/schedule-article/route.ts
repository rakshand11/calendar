import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { topic, scheduledAt } = await req.json();

        if (!topic || !scheduledAt) {
            return NextResponse.json({ error: "Topic and scheduledAt are required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection("articles").insertOne({
            topic,
            scheduledAt: new Date(scheduledAt),
            status: "pending",
            content: null,
            userEmail: session.user?.email,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "Article scheduled!", id: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}