"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/db";
import {
    User as UserIcon,
    Upload,
    Info,
    Check,
    X,
    Trash2,
    Globe,
    Calendar,
    Clock,
    MapPin
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [profile, setProfile] = useState({
        displayName: "",
        welcomeMessage: "",
        language: "English",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "12h (am/pm)",
        country: "India",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        photoURL: ""
    });

    // Initial Data State (for Cancel)
    const [initialProfile, setInitialProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.uid) {
                try {
                    const data = await getUserProfile(user.uid);
                    if (data) {
                        const profileData = {
                            displayName: data.displayName || "",
                            welcomeMessage: data.welcomeMessage || "Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.",
                            language: data.language || "English",
                            dateFormat: data.dateFormat || "DD/MM/YYYY",
                            timeFormat: data.timeFormat || "12h (am/pm)",
                            country: data.country || "India",
                            timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                            photoURL: data.photoURL || ""
                        };
                        setProfile(profileData);
                        setInitialProfile(profileData);
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user?.uid) return;
        setSaving(true);
        setMessage(null);
        try {
            await updateUserProfile(user.uid, profile);
            setInitialProfile(profile);
            setMessage({ type: 'success', text: 'Changes saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error saving profile:", error);
            setMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (initialProfile) {
            setProfile(initialProfile);
        }
    };

    const handleDeleteAccount = () => {
        if (confirm("Are you sure you want to delete your account? This action is permanent.")) {
            alert("Account deletion is requested. Please contact support to finalize.");
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Account details</p>
                    <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
                </div>
                {message && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                        {message.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {/* Photo Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-2">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-slate-100">
                            {profile.photoURL ? (
                                <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-12 h-12" />
                            )}
                        </div>
                        <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="w-6 h-6 text-white" />
                        </button>
                    </div>
                    <div className="text-center md:text-left">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all mb-2">
                            Upload picture
                        </button>
                        <p className="text-xs text-slate-400">JPG, GIF or PNG. Max size of 5MB.</p>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="grid gap-8">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            Name
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                        </label>
                        <input
                            type="text"
                            value={profile.displayName}
                            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all"
                        />
                    </div>

                    {/* Welcome Message */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            Welcome Message
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                        </label>
                        <textarea
                            value={profile.welcomeMessage}
                            onChange={(e) => setProfile({ ...profile, welcomeMessage: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all resize-none"
                        />
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            Language
                        </label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={profile.language}
                                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all appearance-none"
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                            </select>
                        </div>
                    </div>

                    {/* Format Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                Date Format
                                <Info className="w-3.5 h-3.5 text-slate-400" />
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={profile.dateFormat}
                                    onChange={(e) => setProfile({ ...profile, dateFormat: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all appearance-none"
                                >
                                    <option>DD/MM/YYYY</option>
                                    <option>MM/DD/YYYY</option>
                                    <option>YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                Time Format
                                <Info className="w-3.5 h-3.5 text-slate-400" />
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={profile.timeFormat}
                                    onChange={(e) => setProfile({ ...profile, timeFormat: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all appearance-none"
                                >
                                    <option>12h (am/pm)</option>
                                    <option>24h</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            Country
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={profile.country}
                                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all appearance-none"
                            >
                                <option>India</option>
                                <option>United States</option>
                                <option>United Kingdom</option>
                                <option>Canada</option>
                            </select>
                        </div>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                Time Zone
                            </label>
                            <p className="text-xs font-medium text-slate-400">
                                Current Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={profile.timezone}
                                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#6C5DD3]/10 focus:border-[#6C5DD3] transition-all appearance-none"
                            >
                                <option value={profile.timezone}>{profile.timezone} (Standard Time)</option>
                                <option value="UTC">UTC (Universal Time)</option>
                                <option value="America/New_York">Eastern Time (US & Canada)</option>
                                <option value="Europe/London">London</option>
                                <option value="Asia/Tokyo">Tokyo</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100 gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#5A4BCF] transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                            ) : null}
                            Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-6 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
