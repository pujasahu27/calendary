"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile, getBookingsForHost, Booking } from "@/lib/db";
import {
    Calendar,
    Clock,
    Copy,
    ExternalLink,
    Check,
    Settings,
    Share2,
    Link as LinkIcon,
    MoreVertical,
    User as UserIcon,
    Video,
    ChevronRight,
    Search,
    Filter
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import ReminderBanner from "@/components/ReminderBanner";
import { format, isAfter, isBefore } from "date-fns";

export default function BookingsPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    useEffect(() => {
        const fetchData = async () => {
            if (user?.uid) {
                try {
                    const [profileData, bookingsData] = await Promise.all([
                        getUserProfile(user.uid),
                        getBookingsForHost(user.uid)
                    ]);
                    setProfile(profileData);
                    setBookings(bookingsData);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [user]);

    const categorizedBookings = useMemo(() => {
        const now = new Date();
        const upcoming = bookings.filter(b => {
            const date = b.date?.toDate ? b.date.toDate() : new Date(b.date as any);
            return isAfter(date, now) && b.status !== 'cancelled';
        }).sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date as any);
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date as any);
            return dateA.getTime() - dateB.getTime();
        });

        const past = bookings.filter(b => {
            const date = b.date?.toDate ? b.date.toDate() : new Date(b.date as any);
            return isBefore(date, now) || b.status === 'cancelled';
        }).sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date as any);
            const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date as any);
            return dateB.getTime() - dateA.getTime();
        });

        return { upcoming, past };
    }, [bookings]);

    const copyToClipboard = (link: string, id: string) => {
        if (link) {
            navigator.clipboard.writeText(link);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#6B5CE7] rounded-full animate-spin border-t-transparent"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const currentBookings = activeTab === 'upcoming' ? categorizedBookings.upcoming : categorizedBookings.past;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Top Aesthetic Header / Host Profile Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar Column */}
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#6B5CE7] to-[#8E7CFF] flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-indigo-100 transition-transform group-hover:scale-105 duration-300">
                                {profile?.username ? profile.username.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
                        </div>

                        {/* Profile Info Column */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">
                                    {user?.displayName || profile?.username || "Dashboard"}
                                </h1>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-[#6B5CE7] border border-indigo-100">
                                    Pro Host
                                </span>
                            </div>
                            <p className="text-slate-500 font-medium text-lg mb-4 flex items-center justify-center md:justify-start gap-2">
                                {profile?.email || user?.email}
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-slate-400">Personal Calendar</span>
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                {profile?.username && (
                                    <Link
                                        href={`/${profile.username}`}
                                        target="_blank"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#6B5CE7] text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-[#5A4BCF] transition-all hover:-translate-y-0.5"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Landing Page
                                    </Link>
                                )}
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                                    <Share2 className="w-4 h-4 text-slate-400" />
                                    Share Link
                                </button>
                            </div>
                        </div>

                        {/* Stats Box */}
                        <div className="hidden lg:flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-center px-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Upcoming</p>
                                <p className="text-2xl font-black text-slate-800">{categorizedBookings.upcoming.length}</p>
                            </div>
                            <div className="w-px h-10 bg-slate-200"></div>
                            <div className="text-center px-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Past</p>
                                <p className="text-2xl font-black text-slate-800">{categorizedBookings.past.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                <ReminderBanner />

                {/* Search & Tabs Navigation */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <div className="flex p-1 bg-slate-100 rounded-2xl w-full md:w-auto self-start">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'upcoming'
                                    ? 'bg-white text-[#6B5CE7] shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'past'
                                    ? 'bg-white text-[#6B5CE7] shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Past & Cancelled
                        </button>
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#6B5CE7] transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a booking..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-[#6B5CE7] transition-all"
                        />
                    </div>
                </div>

                {/* Bookings Grid/List */}
                <div className="grid gap-6">
                    {currentBookings.length === 0 ? (
                        <div className="bg-white border border-dashed border-slate-300 rounded-[2rem] p-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                <Calendar className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                {activeTab === 'upcoming' ? 'Ready for new meetings?' : 'No past history'}
                            </h3>
                            <p className="text-slate-500 max-w-sm mx-auto text-lg leading-relaxed">
                                {activeTab === 'upcoming'
                                    ? "You don't have any upcoming bookings yet. Share your link to get started!"
                                    : "You haven't had any completed or cancelled meetings yet."}
                            </p>
                            {activeTab === 'upcoming' && (
                                <button className="mt-8 px-8 py-3 bg-[#6B5CE7] text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-[#5A4BCF] transition-all">
                                    Explore Events
                                </button>
                            )}
                        </div>
                    ) : (
                        currentBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="group relative bg-white border border-slate-200 rounded-[2rem] p-6 transition-all hover:border-[#6B5CE7]/30 hover:shadow-2xl hover:shadow-indigo-500/5 overflow-hidden"
                            >
                                <div className="flex flex-col lg:flex-row gap-6 items-start">
                                    {/* Date Visualizer Column */}
                                    <div className="flex lg:flex-col items-center gap-3 shrink-0 p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                                        <div className="text-center min-w-[3rem]">
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                                {booking.date?.toDate ? format(booking.date.toDate(), 'MMM') : '---'}
                                            </p>
                                            <p className="text-2xl font-black text-slate-800">
                                                {booking.date?.toDate ? format(booking.date.toDate(), 'dd') : '--'}
                                            </p>
                                        </div>
                                        <div className="hidden lg:block w-8 h-px bg-slate-200"></div>
                                        <div className="text-sm font-bold text-slate-500">
                                            {booking.date?.toDate ? format(booking.date.toDate(), 'p') : '00:00'}
                                        </div>
                                    </div>

                                    {/* Main Content Column */}
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-extrabold text-[#1E293B] truncate leading-tight group-hover:text-[#6B5CE7] transition-colors">
                                                Meeting with {booking.guestName}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${booking.status === 'confirmed'
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-slate-50 text-slate-500 border border-slate-100'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-slate-500 font-medium text-sm mb-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-colors">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <span>{booking.duration} Minutes Duration</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-colors">
                                                    <Video className="w-4 h-4" />
                                                </div>
                                                <span className="max-w-[150px] truncate">{booking.meetingLink ? 'Google Meet Active' : 'No link generated'}</span>
                                            </div>
                                        </div>

                                        {booking.notes && (
                                            <div className="relative pl-6 py-2 mb-5 group-hover:translate-x-1 transition-transform">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 rounded-full group-hover:bg-indigo-200"></div>
                                                <p className="text-sm text-slate-500 italic font-medium leading-relaxed">
                                                    "{booking.notes}"
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4">
                                            {booking.meetingLink ? (
                                                <Link
                                                    href={booking.meetingLink}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6B5CE7] text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-[#5A4BCF] transition-all hover:-translate-y-0.5"
                                                >
                                                    Join Now
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`mailto:${booking.guestEmail}`}
                                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                                                >
                                                    Contact Guest
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => booking.meetingLink && copyToClipboard(booking.meetingLink, booking.id)}
                                                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${copiedId === booking.id
                                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                                        : "border-slate-100 text-slate-500 hover:border-indigo-100 hover:text-[#6B5CE7] hover:bg-slate-50"
                                                    }`}
                                            >
                                                {copiedId === booking.id ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <LinkIcon className="w-4 h-4" />
                                                        Copy Link
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Menu Actions */}
                                    <div className="absolute top-6 right-6">
                                        <button className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
