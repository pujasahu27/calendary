"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateAvailability } from "@/lib/db";
import { ArrowRight, Calendar, Check, Copy, ExternalLink, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type DaySchedule = {
    enabled: boolean;
    start: string;
    end: string;
};

export default function OnboardingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    // Availability state
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
        Monday: { enabled: true, start: "09:00", end: "17:00" },
        Tuesday: { enabled: true, start: "09:00", end: "17:00" },
        Wednesday: { enabled: true, start: "09:00", end: "17:00" },
        Thursday: { enabled: true, start: "09:00", end: "17:00" },
        Friday: { enabled: true, start: "09:00", end: "17:00" },
        Saturday: { enabled: false, start: "09:00", end: "17:00" },
        Sunday: { enabled: false, start: "09:00", end: "17:00" },
    });

    const [username, setUsername] = useState("");

    useEffect(() => {
        const checkOnboarding = async () => {
            if (user?.uid) {
                const profile = await getUserProfile(user.uid);
                if (profile?.onboardingComplete) {
                    router.push("/dashboard");
                } else {
                    setUsername(profile?.username || "");
                    setLoading(false);
                }
            }
        };
        checkOnboarding();
    }, [user, router]);

    const toggleDay = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], enabled: !prev[day].enabled }
        }));
    };

    const updateTime = (day: string, field: "start" | "end", value: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleComplete = async () => {
        if (!user) return;
        setSaving(true);

        try {
            // Convert schedule to availability format
            const enabledDays = DAYS.filter(day => schedule[day].enabled);

            // For simplicity, use the first enabled day's times as global hours
            const firstEnabledDay = DAYS.find(day => schedule[day].enabled);
            const hours = firstEnabledDay
                ? { start: schedule[firstEnabledDay].start, end: schedule[firstEnabledDay].end }
                : { start: "09:00", end: "17:00" };

            await updateAvailability(user.uid, {
                timezone,
                days: enabledDays,
                hours,
                disabledDates: []
            });

            // Mark onboarding as complete
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                onboardingComplete: true
            });

            setStep(3);
        } catch (error) {
            console.error("Error completing onboarding:", error);
            alert("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const copyLink = () => {
        const link = `${window.location.origin}/${username}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#2D1B69] to-[#1a0f3d]">
                <div className="w-8 h-8 border-4 border-[#9F7AEA] rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] to-[#1a0f3d] flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-sm font-medium text-white/60">STEP {step} OF 3</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#9F7AEA] to-[#D6BCFA] transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step 1: Welcome */}
                {step === 1 && (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#9F7AEA] to-[#D6BCFA] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#9F7AEA]/30">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
                            Welcome to Calendary! 🎉
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                            Let's get you set up in just a few steps. We'll help you configure your availability so people can easily book time with you.
                        </p>
                        <button
                            onClick={() => setStep(2)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9F7AEA] to-[#805AD5] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#9F7AEA]/30 transition-all"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Step 2: Availability Setup */}
                {step === 2 && (
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right duration-500">
                        <div className="bg-gradient-to-r from-[#9F7AEA] to-[#805AD5] p-8 text-white">
                            <h2 className="text-3xl font-bold mb-2">When are you available to meet with people?</h2>
                            <p className="text-white/80">You'll only be booked during these times (you can change these times and add other schedules later)</p>
                        </div>

                        <div className="p-8">
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Weekly hours</label>
                                <p className="text-sm text-slate-500 mb-4">Set when you are typically available for meetings</p>
                            </div>

                            <div className="space-y-3">
                                {DAYS.map(day => {
                                    const daySchedule = schedule[day];
                                    const initial = day.charAt(0);

                                    return (
                                        <div
                                            key={day}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${daySchedule.enabled
                                                    ? "bg-[#6B5CE7]/5 border-[#6B5CE7]"
                                                    : "bg-slate-50 border-slate-200"
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleDay(day)}
                                                className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all ${daySchedule.enabled
                                                        ? "bg-[#6B5CE7] text-white shadow-md shadow-[#6B5CE7]/30"
                                                        : "bg-slate-200 text-slate-400"
                                                    }`}
                                            >
                                                {initial}
                                            </button>

                                            <div className="flex-1 flex items-center gap-3">
                                                <input
                                                    type="time"
                                                    value={daySchedule.start}
                                                    onChange={(e) => updateTime(day, "start", e.target.value)}
                                                    disabled={!daySchedule.enabled}
                                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5CE7] disabled:bg-slate-100 disabled:text-slate-400"
                                                />
                                                <span className="text-slate-400">—</span>
                                                <input
                                                    type="time"
                                                    value={daySchedule.end}
                                                    onChange={(e) => updateTime(day, "end", e.target.value)}
                                                    disabled={!daySchedule.enabled}
                                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6B5CE7] disabled:bg-slate-100 disabled:text-slate-400"
                                                />
                                            </div>

                                            <button
                                                onClick={() => toggleDay(day)}
                                                className="text-sm text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                {daySchedule.enabled ? "×" : ""}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleComplete}
                                    disabled={saving || !DAYS.some(day => schedule[day].enabled)}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9F7AEA] to-[#805AD5] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#9F7AEA]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? "Saving..." : "Continue"}
                                    {!saving && <ArrowRight className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
                            You're all set! 🚀
                        </h1>
                        <p className="text-lg text-slate-600 mb-8">
                            Your scheduling page is ready. Share this link to start accepting bookings:
                        </p>

                        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-8 flex items-center gap-3 max-w-2xl mx-auto">
                            <Calendar className="w-5 h-5 text-[#6B5CE7] flex-shrink-0" />
                            <code className="flex-1 text-sm font-mono text-slate-700 truncate">
                                {window.location.origin}/{username}
                            </code>
                            <button
                                onClick={copyLink}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                title="Copy link"
                            >
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-slate-500" />}
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={`/${username}`}
                                target="_blank"
                                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#6B5CE7] text-[#6B5CE7] font-semibold rounded-xl hover:bg-[#6B5CE7]/5 transition-all"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Preview Page
                            </a>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9F7AEA] to-[#805AD5] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#9F7AEA]/30 transition-all"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
