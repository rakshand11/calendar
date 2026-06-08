import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { generateArticle } from "@/lib/gemini";

export async function GET() {
    const client = await clientPromise;
    const db = client.db();

    const now = new Date();
    const articles = await db.collection("articles").find({
        status: "pending",
        scheduledAt: { $lte: now },
    }).toArray();

    console.log(`Cron: Found ${articles.length} articles to generate`);

    for (const article of articles) {
        try {
            await db.collection("articles").updateOne(
                { _id: article._id },
                { $set: { status: "processing" } }
            );

            const content = await generateArticle(article.topic);

            await db.collection("articles").updateOne(
                { _id: article._id },
                { $set: { status: "done", content, generatedAt: new Date() } }
            );
        } catch (error) {
            console.error(await db.collection("articles").updateOne(
                { _id: article._id },
                { $set: { status: "failed" } }
            ));
        }
    }

    return NextResponse.json({ message: "Cron done", processed: articles.length });
}