"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

type Article = {
    _id: string;
    topic: string;
    scheduledAt: string;
    status: "pending" | "processing" | "done" | "failed";
};

export default function DashboardPage() {
    const today = new Date();
    const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [articles, setArticles] = useState<Article[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [topic, setTopic] = useState("");
    const [time, setTime] = useState("10:00");

    const year = cur.getFullYear();
    const month = cur.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = firstDay + daysInMonth;
    const rows = Math.ceil(totalCells / 7) * 7;

    const cells = Array.from({ length: rows }, (_, i) => {
        if (i < firstDay) return null;
        const day = i - firstDay + 1;
        if (day <= daysInMonth) return { day, other: false };
        return { day: day - daysInMonth, other: true };
    });

    async function fetchArticles() {

        fetch('http://127.0.0.1:7632/ingest/644d8814-dc14-4d22-9a06-2b45ea783de3', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'c535fb' }, body: JSON.stringify({ sessionId: 'c535fb', location: 'dashboard/page.tsx:fetchArticles:start', message: 'fetchArticles called', data: {}, timestamp: Date.now(), hypothesisId: 'B' }) }).catch(() => { });

        const res = await fetch("/api/get-articles");
        const data = await res.json();

        fetch('http://127.0.0.1:7632/ingest/644d8814-dc14-4d22-9a06-2b45ea783de3', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'c535fb' }, body: JSON.stringify({ sessionId: 'c535fb', location: 'dashboard/page.tsx:fetchArticles:response', message: 'fetchArticles response', data: { status: res.status, ok: res.ok, articleCount: data.articles?.length ?? 0, sampleKeys: data.articles?.[0] ? Object.keys(data.articles[0]) : [], sampleScheduledAt: data.articles?.[0]?.scheduledAt, sampleScheduleAt: data.articles?.[0]?.scheduleAt }, timestamp: Date.now(), hypothesisId: 'B,D' }) }).catch(() => { });
        // #endregion
        setArticles(data.articles || []);
    }

    useEffect(() => {
        const interval = setInterval(fetchArticles, 30000);
        const timeout = setTimeout(fetchArticles, 0);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    function getArticlesForDay(day: number) {
        return articles.filter((a) => {
            const d = new Date(a.scheduledAt);
            return (
                d.getDate() === day &&
                d.getMonth() === month &&
                d.getFullYear() === year
            );
        });
    }

    function formatDateForInput(y: number, m: number, d: number) {
        return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }

    function openDialog(dateStr?: string) {
        setSelectedDate(dateStr || "");
        setTopic("");
        setTime("10:00");
        setShowDialog(true);
    }

    async function handleSchedule() {
        if (!topic || !selectedDate || !time) return;
        const scheduledAt = new Date(`${selectedDate}T${time}:00`);
        const body = { topic, scheduledAt };

        fetch('http://127.0.0.1:7632/ingest/644d8814-dc14-4d22-9a06-2b45ea783de3', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'c535fb' }, body: JSON.stringify({ sessionId: 'c535fb', location: 'dashboard/page.tsx:handleSchedule:request', message: 'schedule request body', data: { topic, scheduledAt: scheduledAt.toISOString() }, timestamp: Date.now(), hypothesisId: 'C' }) }).catch(() => { });
        // #endregion
        const res = await fetch("/api/schedule-article", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const result = await res.json();

        fetch('http://127.0.0.1:7632/ingest/644d8814-dc14-4d22-9a06-2b45ea783de3', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'c535fb' }, body: JSON.stringify({ sessionId: 'c535fb', location: 'dashboard/page.tsx:handleSchedule:response', message: 'schedule response', data: { status: res.status, ok: res.ok, result }, timestamp: Date.now(), hypothesisId: 'C' }) }).catch(() => { });
        // #endregion
        setShowDialog(false);
        fetchArticles();
    }

    function getStatusStyle(status: string) {
        if (status === "done") return "bg-green-100 text-green-700";
        if (status === "processing") return "bg-blue-100 text-blue-700";
        if (status === "failed") return "bg-red-100 text-red-700";
        return "bg-yellow-100 text-yellow-700";
    }

    return (
        <div className="min-h-screen bg-black p-4">
            <div className="rounded-2xl border border-gray-200 overflow-hidden h-[calc(100vh-2rem)] flex flex-col bg-white">


                <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-200">
                    <button
                        onClick={() => setCur(new Date(today.getFullYear(), today.getMonth(), 1))}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Today
                    </button>
                    <button onClick={() => setCur(new Date(year, month - 1, 1))} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 text-lg leading-none">‹</button>
                    <button onClick={() => setCur(new Date(year, month + 1, 1))} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 text-lg leading-none">›</button>
                    <h2 className="text-xl font-medium text-gray-800 flex-1">{MONTHS[month]} {year}</h2>
                    <button
                        onClick={() => openDialog(formatDateForInput(today.getFullYear(), today.getMonth(), today.getDate()))}
                        className="px-4 py-1.5 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        + Schedule Article
                    </button>
                </div>


                <div className="grid grid-cols-7 border-b border-gray-200">
                    {DAYS.map(d => (
                        <div key={d} className="text-center text-xs text-gray-400 font-medium py-2 tracking-widest">{d}</div>
                    ))}
                </div>


                <div className="grid grid-cols-7 flex-1 bg-white overflow-y-auto" style={{ gridTemplateRows: `repeat(${rows / 7}, minmax(80px, 1fr))` }}>
                    {cells.map((cell, i) => {
                        const isToday =
                            cell !== null &&
                            !cell.other &&
                            cell.day === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();

                        const dayArticles = cell && !cell.other ? getArticlesForDay(cell.day) : [];

                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    if (cell && !cell.other) {
                                        openDialog(formatDateForInput(year, month, cell.day));
                                    }
                                }}
                                className={`border-r border-b border-gray-200 p-2 flex flex-col gap-1
                  ${i % 7 === 6 ? "border-r-0" : ""}
                  ${cell && !cell.other ? "cursor-pointer hover:bg-gray-50" : ""}`}
                            >
                                {cell && (
                                    <>
                                        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                      ${isToday ? "bg-blue-500 text-white" : cell.other ? "text-gray-300" : "text-gray-800"}`}>
                                            {cell.day}
                                        </span>
                                        {dayArticles.map((article) => (
                                            <Link
                                                key={article._id}
                                                href={`/articles/${article._id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className={`text-xs px-2 py-1 rounded-md truncate font-medium ${getStatusStyle(article.status)}`}
                                            >
                                                {article.topic}
                                            </Link>
                                        ))}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>


            {showDialog && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Article</h3>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-sm text-gray-500 mb-1 block">Topic</label>
                                <input
                                    type="text"
                                    placeholder="Search anything you want to know about"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-black mb-1 block">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-black mb-1 block">Time</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black outline-none focus:border-black"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setShowDialog(false)}
                                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSchedule}
                                className="flex-1 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
                            >
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}