import cron from "node-cron"
import clientPromise from "./mongodb"
import { generateArticle } from "./gemini"

let cronStarted = false

export function startCron() {
    if (cronStarted) return
    cronStarted = true

    cron.schedule("* * * * *", async () => {
        console.log("Cron running - checking for scheduled articles...")

        const client = await clientPromise;
        const db = client.db()

        const now = new Date()

        const articles = await db.collection("articles").find({
            status: "pending",
            sechduleAt: { $lte: now },
        }).toArray()

        console.log(`Found ${articles.length}articles to generate`)

        for (const article of articles) {
            try {
                await db.collection("articles").updateOne({
                    _id: article._id
                }, {
                    $set: { status: "processing" }
                })

                const content = await generateArticle(article.topic)
                await db.collection("articles").updateOne(
                    { _id: article._id },
                    { $set: { status: "done", content, generatedAt: new Date() } }
                )
                console.log(`Article generated for topic: ${article.topic}`)
            } catch (error) {
                console.error(`Failed to generate article for ${article.topic}:`, error)
                await db.collection("articles").updateOne(
                    { _id: article._id },
                    { $set: { status: "failed" } }
                )
            }
        }
    })

}
