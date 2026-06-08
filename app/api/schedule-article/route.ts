import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("RECEIVED BODY:", body);

        const { topic, scheduledAt } = body;

        if (!topic || !scheduledAt) {
            console.log("MISSING FIELDS - topic:", topic, "scheduledAt:", scheduledAt);
            return NextResponse.json(
                { error: "Topic and scheduledAt are required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection("articles").insertOne({
            topic,
            scheduledAt: new Date(scheduledAt),
            status: "pending",
            content: null,
            createdAt: new Date(),
        });

        return NextResponse.json({
            message: "Article scheduled!",
            id: result.insertedId,
        });
    } catch (error) {
        console.error("SCHEDULE ARTICLE ERROR:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}