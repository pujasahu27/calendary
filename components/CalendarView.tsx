"use client";

import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useState } from "react";

type TimeInterval = {
    start: string;
    end: string;
};

type DaySchedule = {
    enabled: boolean;
    intervals: TimeInterval[];
};

type CalendarViewProps = {
    timezone: string;
    schedule: Record<string, DaySchedule>;
};

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const h = hours % 12 === 0 ? 12 : hours % 12;
    const ampm = hours < 12 ? 'am' : 'pm';
    return `${h}:${minutes.toString().padStart(2, '0')}${ampm}`;
};

export default function CalendarView({ timezone, schedule }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    // Generate calendar grid
    const calendarDays = [];

    // Previous month filler
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
        calendarDays.push({
            day: prevMonthDays - i,
            isCurrentMonth: false,
            daySchedule: null
        });
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(year, month, day);
        const dayName = FULL_DAYS[date.getDay()];
        const daySchedule = schedule[dayName];

        calendarDays.push({
            day,
            isCurrentMonth: true,
            daySchedule,
            date
        });
    }

    // Next month filler
    const remainingSlots = 42 - calendarDays.length;
    for (let day = 1; day <= remainingSlots; day++) {
        calendarDays.push({
            day,
            isCurrentMonth: false,
            daySchedule: null
        });
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg">
            {/* Calendar Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <h3 className="text-base font-semibold text-slate-900 min-w-[140px] text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                        onClick={() => changeMonth(1)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
                <div className="text-sm text-[#0B5CFF] flex items-center gap-1">
                    {timezone.split('/').pop()?.replace(/_/g, " ")}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {DAYS_OF_WEEK.map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-slate-600 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-px bg-slate-200">
                    {calendarDays.map((item, index) => {
                        const isAvailable = item.daySchedule?.enabled;
                        const intervals = item.daySchedule?.intervals || [];

                        return (
                            <div
                                key={index}
                                className={`bg-white min-h-[100px] p-2 ${!item.isCurrentMonth ? "bg-slate-50" : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium ${item.isCurrentMonth ? "text-slate-900" : "text-slate-400"
                                        }`}>
                                        {item.day}
                                    </span>
                                    {isAvailable && item.isCurrentMonth && (
                                        <RefreshCw className="w-3 h-3 text-slate-400" />
                                    )}
                                </div>

                                {isAvailable && item.isCurrentMonth && (
                                    <div className="space-y-1">
                                        {intervals.map((interval, idx) => (
                                            <div key={idx} className="text-xs text-slate-600">
                                                {formatTime(interval.start)} – {formatTime(interval.end)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
