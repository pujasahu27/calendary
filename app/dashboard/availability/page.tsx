"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateAvailability } from "@/lib/db";
import { Clock, Save, Globe, Loader2, List, Calendar as CalendarIcon, Plus, X, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import CalendarView from "@/components/CalendarView";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

// Generate time options in 15-minute intervals
const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const h = hour % 12 === 0 ? 12 : hour % 12;
            const ampm = hour < 12 ? 'am' : 'pm';
            const timeStr = `${h}:${minute.toString().padStart(2, '0')}${ampm}`;
            const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            times.push({ label: timeStr, value });
        }
    }
    return times;
};

const TIME_OPTIONS = generateTimeOptions();

type TimeInterval = {
    start: string;
    end: string;
};

type DaySchedule = {
    enabled: boolean;
    intervals: TimeInterval[];
};

export default function AvailabilityPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

    const [timezone, setTimezone] = useState("Asia/Calcutta");
    const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({});

    useEffect(() => {
        // Initialize schedule
        const initialSchedule: Record<string, DaySchedule> = {};
        DAYS.forEach(day => {
            initialSchedule[day] = {
                enabled: false,
                intervals: [{ start: "09:00", end: "17:00" }]
            };
        });
        setSchedule(initialSchedule);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.uid) {
                try {
                    const data = await getUserProfile(user.uid);
                    if (data?.availability) {
                        setTimezone(data.availability.timezone || "Asia/Calcutta");

                        // Convert old format to new format
                        const newSchedule: Record<string, DaySchedule> = {};
                        DAYS.forEach(day => {
                            const isEnabled = data.availability.days?.includes(day) || false;
                            newSchedule[day] = {
                                enabled: isEnabled,
                                intervals: isEnabled
                                    ? [{
                                        start: data.availability.hours?.start || "09:00",
                                        end: data.availability.hours?.end || "17:00"
                                    }]
                                    : [{ start: "09:00", end: "17:00" }]
                            };
                        });
                        setSchedule(newSchedule);
                    }
                } catch (error) {
                    console.error("Error fetching availability:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            // Convert to old format for compatibility
            const enabledDays = DAYS.filter(day => schedule[day]?.enabled);
            const firstEnabledDay = DAYS.find(day => schedule[day]?.enabled);
            const hours = firstEnabledDay && schedule[firstEnabledDay].intervals[0]
                ? schedule[firstEnabledDay].intervals[0]
                : { start: "09:00", end: "17:00" };

            await updateAvailability(user.uid, {
                timezone,
                days: enabledDays,
                hours,
                disabledDates: []
            });
            alert("Availability saved successfully!");
        } catch (error) {
            console.error("Error saving availability:", error);
            alert("Failed to save availability.");
        } finally {
            setSaving(false);
        }
    };

    const toggleDay = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                enabled: !prev[day]?.enabled
            }
        }));
    };

    const addInterval = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                intervals: [...(prev[day]?.intervals || []), { start: "09:00", end: "17:00" }]
            }
        }));
    };

    const removeInterval = (day: string, index: number) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                intervals: prev[day].intervals.filter((_, i) => i !== index)
            }
        }));
    };

    const updateInterval = (day: string, index: number, field: 'start' | 'end', value: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                intervals: prev[day].intervals.map((interval, i) =>
                    i === index ? { ...interval, [field]: value } : interval
                )
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#0B5CFF] rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Availability</h1>
            </div>

            {/* Schedule Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-[#0B5CFF] flex items-center gap-2">
                        Working hours (default)
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Active on: <span className="text-[#0B5CFF]">1 event type</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "list"
                                ? "bg-slate-100 text-slate-900"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("calendar")}
                            className={`px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "calendar"
                                ? "bg-slate-100 text-slate-900"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <CalendarIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Weekly Hours Section */}
            {viewMode === "list" ? (
                <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Weekly hours
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Set when you are typically available for meetings</p>
                        </div>
                    </div>

                    {/* Days List */}
                    <div className="space-y-3">
                        {DAYS.map((day, dayIndex) => {
                            const daySchedule = schedule[day];
                            const isEnabled = daySchedule?.enabled;

                            return (
                                <div key={day} className="space-y-2">
                                    {isEnabled ? (
                                        daySchedule.intervals.map((interval, intervalIndex) => (
                                            <div key={intervalIndex} className="flex items-center gap-4">
                                                {intervalIndex === 0 && (
                                                    <button
                                                        onClick={() => toggleDay(day)}
                                                        className="w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all bg-[#0B5CFF] text-white"
                                                    >
                                                        {DAY_INITIALS[dayIndex]}
                                                    </button>
                                                )}
                                                {intervalIndex > 0 && <div className="w-10" />}

                                                <div className="flex-1 flex items-center gap-3">
                                                    {/* Start Time Dropdown */}
                                                    <select
                                                        value={interval.start}
                                                        onChange={(e) => updateInterval(day, intervalIndex, 'start', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-[#0B5CFF] bg-white min-w-[120px]"
                                                    >
                                                        {TIME_OPTIONS.map(time => (
                                                            <option key={time.value} value={time.value}>
                                                                {time.label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <span className="text-slate-400">-</span>

                                                    {/* End Time Dropdown */}
                                                    <select
                                                        value={interval.end}
                                                        onChange={(e) => updateInterval(day, intervalIndex, 'end', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-[#0B5CFF] bg-white min-w-[120px]"
                                                    >
                                                        {TIME_OPTIONS.map(time => (
                                                            <option key={time.value} value={time.value}>
                                                                {time.label}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        onClick={() => {
                                                            if (daySchedule.intervals.length === 1) {
                                                                toggleDay(day);
                                                            } else {
                                                                removeInterval(day, intervalIndex);
                                                            }
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-slate-600"
                                                        title="Remove"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-slate-400 hover:text-slate-600" title="Copy to all">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    {intervalIndex === daySchedule.intervals.length - 1 && (
                                                        <button
                                                            onClick={() => addInterval(day)}
                                                            className="p-2 text-slate-400 hover:text-slate-600"
                                                            title="Add hours"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => toggleDay(day)}
                                                className="w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all bg-slate-100 text-slate-400"
                                            >
                                                {DAY_INITIALS[dayIndex]}
                                            </button>
                                            <div className="flex-1 flex items-center gap-2">
                                                <span className="text-sm text-slate-500">Unavailable</span>
                                                <button
                                                    onClick={() => toggleDay(day)}
                                                    className="p-1 text-slate-400 hover:text-slate-600"
                                                    title="Make available"
                                                >
                                                    <Plus className="w-4 h-4 border border-slate-300 rounded-full" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Timezone */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-slate-500" />
                            <select
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent text-[#0B5CFF]"
                            >
                                <option value="Asia/Calcutta">India Standard Time</option>
                                <option value="America/New_York">Eastern Time</option>
                                <option value="America/Los_Angeles">Pacific Time</option>
                                <option value="Europe/London">London Time</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-6">
                    <CalendarView
                        timezone={timezone}
                        schedule={schedule}
                    />
                </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#0B5CFF] text-white font-medium rounded-full hover:bg-[#0A4FD9] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
