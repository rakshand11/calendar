import { NextResponse } from "next/server";
import { startCron } from "@/lib/cron";

export async function GET() {
    startCron();
    return NextResponse.json({ message: "Cron started" });
}