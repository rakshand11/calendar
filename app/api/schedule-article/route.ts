import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { topic, scheduleAt } = await req.json()
        if (!topic || !scheduleAt) {
            return NextResponse.json({
                error: "Topic and scheduleAt are required"
            }, {
                status: 400
            })
        }

        const client = await clientPromise
        const db = client.db()
        const result = await db.collection("articles").insertOne({
            topic,
            scheduleAt: new Date(scheduleAt),
            status: "pending",
            content: null,
            createdAt: new Date()
        })

        return NextResponse.json({
            msg: "Article Scheduled",
            id: result.insertedId
        })
    } catch (error) {
        console.error("Schedule Article Error", error)
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}