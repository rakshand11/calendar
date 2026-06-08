import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const client = await clientPromise;
        const db = client.db();

        await db.collection("articles").deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}