"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/db";
import {
    Clock,
    Calendar,
    Shield,
    Bell,
    MapPin,
    MessageSquare,
    Plane,
    Check,
    X,
    Info,
    ChevronRight,
    Save
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [settings, setSettings] = useState({
        bufferBefore: 15,
        bufferAfter: 15,
        limitPerDay: 5,
        limitPerWeek: 20,
        minNoticeTime: 24,
        defaultLocation: "Google Meet",
        defaultInstructions: "",
        vacationMode: false,
        emailReminders: true,
        reminderLeadTime: 24,
        welcomeMessage: ""
    });

    const [initialSettings, setInitialSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            if (user?.uid) {
                try {
                    const profile = await getUserProfile(user.uid);
                    if (profile) {
                        const mergedSettings = {
                            bufferBefore: profile.settings?.bufferBefore ?? 15,
                            bufferAfter: profile.settings?.bufferAfter ?? 15,
                            limitPerDay: profile.settings?.limitPerDay ?? 5,
                            limitPerWeek: profile.settings?.limitPerWeek ?? 20,
                            minNoticeTime: profile.settings?.minNoticeTime ?? 24,
                            defaultLocation: profile.settings?.defaultLocation ?? "Google Meet",
                            defaultInstructions: profile.settings?.defaultInstructions ?? "",
                            vacationMode: profile.settings?.vacationMode ?? false,
                            emailReminders: profile.settings?.emailReminders ?? true,
                            reminderLeadTime: profile.settings?.reminderLeadTime ?? 24,
                            welcomeMessage: profile.welcomeMessage || ""
                        };
                        setSettings(mergedSettings);
                        setInitialSettings(mergedSettings);
                    }
                } catch (error) {
                    console.error("Error fetching settings:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchSettings();
    }, [user]);

    const handleSave = async () => {
        if (!user?.uid) return;
        setSaving(true);
        setMessage(null);
        try {
            await updateUserProfile(user.uid, {
                settings: {
                    bufferBefore: settings.bufferBefore,
                    bufferAfter: settings.bufferAfter,
                    limitPerDay: settings.limitPerDay,
                    limitPerWeek: settings.limitPerWeek,
                    minNoticeTime: settings.minNoticeTime,
                    defaultLocation: settings.defaultLocation,
                    defaultInstructions: settings.defaultInstructions,
                    vacationMode: settings.vacationMode,
                    emailReminders: settings.emailReminders,
                    reminderLeadTime: settings.reminderLeadTime
                },
                welcomeMessage: settings.welcomeMessage
            });
            setInitialSettings(settings);
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-[#6C5DD3] rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Preferences & Limits</p>
                    <h1 className="text-3xl font-bold text-slate-900">Advanced Settings</h1>
                </div>
                {message && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                        {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}
            </div>

            <div className="space-y-10">
                {/* 1. Buffer Times */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 text-[#6C5DD3] rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Buffer Times</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                Before Meeting
                                <span className="text-xs font-normal text-slate-400">(minutes)</span>
                            </label>
                            <input
                                type="number"
                                value={settings.bufferBefore}
                                onChange={(e) => setSettings({ ...settings, bufferBefore: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                After Meeting
                                <span className="text-xs font-normal text-slate-400">(minutes)</span>
                            </label>
                            <input
                                type="number"
                                value={settings.bufferAfter}
                                onChange={(e) => setSettings({ ...settings, bufferAfter: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all"
                            />
                        </div>
                        <p className="md:col-span-2 text-xs text-slate-500 italic">
                            Adding a buffer ensures you have time to prepare or wrap up between back-to-back meetings.
                        </p>
                    </div>
                </section>

                {/* 2. Booking Limits */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Booking Limits</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Per Day</label>
                            <input
                                type="number"
                                value={settings.limitPerDay}
                                onChange={(e) => setSettings({ ...settings, limitPerDay: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Per Week</label>
                            <input
                                type="number"
                                value={settings.limitPerWeek}
                                onChange={(e) => setSettings({ ...settings, limitPerWeek: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all"
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Notice & Availability */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <Plane className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Notice & Availability</h2>
                    </div>
                    <div className="space-y-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <div>
                                <h3 className="font-bold text-slate-900">Vacation Mode</h3>
                                <p className="text-xs text-slate-500">Temporarily disable all bookings on your profile.</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, vacationMode: !settings.vacationMode })}
                                className={`w-14 h-8 rounded-full transition-all relative ${settings.vacationMode ? 'bg-[#6C5DD3]' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.vacationMode ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                Minimum Notice Time
                                <span className="text-xs font-normal text-slate-400">(hours)</span>
                            </label>
                            <input
                                type="number"
                                value={settings.minNoticeTime}
                                onChange={(e) => setSettings({ ...settings, minNoticeTime: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all"
                            />
                            <p className="text-[10px] text-slate-400 font-medium">Prevents guests from booking too close to the current time.</p>
                        </div>
                    </div>
                </section>

                {/* 4. Default Content */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Default Content</h2>
                    </div>
                    <div className="space-y-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Default Meeting Location</label>
                            <input
                                type="text"
                                value={settings.defaultLocation}
                                onChange={(e) => setSettings({ ...settings, defaultLocation: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all"
                                placeholder="e.g. Google Meet, Zoom, Physical Address..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Booking Instructions</label>
                            <textarea
                                value={settings.defaultInstructions}
                                onChange={(e) => setSettings({ ...settings, defaultInstructions: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all resize-none"
                                placeholder="Instructions sent to guests after booking..."
                            />
                        </div>
                    </div>
                </section>

                {/* 5. Notifications */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                            <Bell className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                    </div>
                    <div className="space-y-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <div>
                                <h3 className="font-bold text-slate-900">Email Reminders</h3>
                                <p className="text-xs text-slate-500">Send an automated reminder to guests before the meeting starts.</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, emailReminders: !settings.emailReminders })}
                                className={`w-14 h-8 rounded-full transition-all relative ${settings.emailReminders ? 'bg-[#6C5DD3]' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.emailReminders ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>

                        {settings.emailReminders && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    Reminder Lead Time
                                    <span className="text-xs font-normal text-slate-400">(hours)</span>
                                </label>
                                <input
                                    type="number"
                                    value={settings.reminderLeadTime}
                                    onChange={(e) => setSettings({ ...settings, reminderLeadTime: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all"
                                />
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Bottom Bar for Saving */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-4xl bg-white/80 backdrop-blur-xl border border-slate-200 p-4 rounded-3xl shadow-2xl flex items-center justify-between z-20">
                <div className="hidden md:block">
                    <p className="text-sm font-bold text-slate-900">Unsaved Changes</p>
                    <p className="text-xs text-slate-500">All your scheduling preferences in one place.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setSettings(initialSettings)}
                        className="flex-1 md:flex-none px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 md:flex-none px-10 py-3 bg-[#6C5DD3] text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-[#5A4BCF] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" /> : <Save className="w-4 h-4" />}
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
