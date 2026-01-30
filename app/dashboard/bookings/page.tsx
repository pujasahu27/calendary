"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/db";
import {
    Calendar,
    Clock,
    Copy,
    ExternalLink,
    Check,
    Settings,
    Share2,
    Link as LinkIcon,
    MoreVertical
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BookingsPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.uid) {
                try {
                    const profileData = await getUserProfile(user.uid);
                    setProfile(profileData);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [user]);

    const bookingLink = profile?.username
        ? `${window.location.origin}/${profile.username}`
        : "";

    const copyToClipboard = () => {
        if (bookingLink) {
            navigator.clipboard.writeText(bookingLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#0069FF] rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Header Section */}
            <header className="flex items-center justify-between mb-8 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-lg">
                        {profile?.username ? profile.username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="font-medium text-slate-700 text-lg">
                        {user?.displayName || profile?.username || "User"}
                    </span>
                </div>

                {profile?.username && (
                    <Link
                        href={`/${profile.username}`}
                        target="_blank"
                        className="text-[#0069FF] hover:text-[#0055CC] font-medium flex items-center gap-1 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View landing page
                    </Link>
                )}
            </header>

            <div className="border-t border-slate-200 mb-8"></div>

            {/* Event Types List */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group relative">
                {/* Event Type Card Content */}
                <div className="p-0">
                    {/* Top colored bar */}
                    <div className="h-1.5 w-full bg-[#8247f5] rounded-t-lg"></div>

                    <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Checkbox */}
                        <div className="pt-1">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-slate-300 text-[#0069FF] focus:ring-[#0069FF] cursor-pointer"
                            />
                        </div>

                        {/* Main Info */}
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">30 Minute Meeting</h3>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                <span>30 min</span>
                                <span>•</span>
                                <span>Google Meet</span>
                                <span>•</span>
                                <span>One-on-One</span>
                            </div>
                            <Link
                                href={`/${profile?.username}`}
                                target="_blank"
                                className="text-[#0069FF] text-sm hover:underline cursor-pointer inline-block mt-1"
                            >
                                View booking page
                            </Link>
                            <div className="mt-6 text-sm text-slate-500 border-t border-slate-100 pt-3">
                                Weekdays, hours vary
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 self-start md:self-center">
                            <div className="flex items-center gap-3 text-slate-500">
                                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors tooltip" title="Copy link">
                                    <LinkIcon className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors" title="Settings">
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-slate-50 rounded-full transition-colors" title="Share">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="h-6 w-px bg-slate-200 mx-1"></div>

                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-3 py-1.5 border border-[#0069FF] text-[#0069FF] rounded-full text-sm font-medium hover:bg-[#0069FF]/5 transition-colors"
                            >
                                <LinkIcon className="w-4 h-4" />
                                {copied ? "Copied!" : "Copy link"}
                            </button>

                            <button className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty state fallback or additional cards could go here */}
        </div>
    );
}
