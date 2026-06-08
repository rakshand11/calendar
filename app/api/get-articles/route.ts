import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const raw = await db
      .collection("articles")
      .find({})
      .sort({ scheduleAt: -1 })
      .toArray();


    fetch('http://127.0.0.1:7632/ingest/644d8814-dc14-4d22-9a06-2b45ea783de3', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'c535fb' }, body: JSON.stringify({ sessionId: 'c535fb', location: 'get-articles/route.ts:GET', message: 'articles fetched from DB', data: { count: raw.length, sampleKeys: raw[0] ? Object.keys(raw[0]) : [], sampleScheduleAt: raw[0]?.scheduleAt, sampleScheduledAt: raw[0]?.scheduledAt }, timestamp: Date.now(), hypothesisId: 'B,D' }) }).catch(() => { });
    // #endregion

    const articles = raw.map((a) => ({
      _id: a._id.toString(),
      topic: a.topic,
      scheduledAt: a.scheduledAt ?? a.scheduleAt,
      status: a.status,
    }));

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Get Articles Error", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
