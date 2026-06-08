import cron from "node-cron";
import clientPromise from "@/lib/mongodb";
import { generateArticle } from "@/lib/gemini";

let cronStarted = false;

export function startCron() {
    if (cronStarted) return;
    cronStarted = true;

    cron.schedule("* * * * *", async () => {
        const now = new Date();
        console.log("Cron running at:", now.toISOString());

        const client = await clientPromise;
        const db = client.db();

        // log all pending articles to see their scheduledAt
        const all = await db.collection("articles").find({ status: "pending" }).toArray();
        console.log("All pending articles:", all.map(a => ({
            topic: a.topic,
            scheduledAt: a.scheduledAt,
            isPast: a.scheduledAt <= now,
        })));

        const articles = await db.collection("articles").find({
            status: "pending",
            scheduledAt: { $lte: now },
        }).toArray();

        console.log(`Found ${articles.length} articles to generate`);

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

                console.log(`Article generated for topic: ${article.topic}`);
            } catch (error) {
                console.error(`Failed to generate article for ${article.topic}:`, error);
                await db.collection("articles").updateOne(
                    { _id: article._id },
                    { $set: { status: "failed" } }
                );
            }
        }
    });
}