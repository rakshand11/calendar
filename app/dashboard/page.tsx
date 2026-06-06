"use client";
import { useState } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function DashboardPage() {
    const today = new Date();
    const [cur, setCur] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

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

    return (
        <div className="min-h-screen bg-gray-100 p-4">
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
                    <h2 className="text-xl font-medium text-gray-800">{MONTHS[month]} {year}</h2>
                </div>


                <div className="grid grid-cols-7 border-b border-gray-200">
                    {DAYS.map(d => (
                        <div key={d} className="text-center text-xs text-gray-400 font-medium py-2 tracking-widest">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 flex-1 bg-white" style={{ gridTemplateRows: `repeat(${rows / 7}, 1fr)` }}>
                    {cells.map((cell, i) => {
                        const isToday =
                            cell !== null &&
                            !cell.other &&
                            cell.day === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();

                        return (
                            <div
                                key={i}
                                className={`border-r border-b border-gray-200 p-2 flex flex-col ${i % 7 === 6 ? "border-r-0" : ""}`}
                            >
                                {cell && (
                                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday ? "bg-blue-500 text-white" : cell.other ? "text-gray-300" : "text-gray-800"}`}>
                                        {cell.day}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}