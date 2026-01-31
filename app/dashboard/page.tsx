"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile, getBookingsForHost } from "@/lib/db";
import {
    Calendar,
    TrendingUp,
    BarChart2,
    Bell,
    Link as LinkIcon,
    Copy,
    ArrowRight,
    Clock
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Booking } from "@/lib/db";
import { Timestamp } from "firebase/firestore";
import { useNotifications } from "@/hooks/useNotifications";
import StatsModal from "@/components/StatsModal";
import { BookingsCalendar, WeeklyChart, MonthSummary, NotificationList } from "@/components/StatsViews";

export default function DashboardPage() {
    const { user } = useAuth();
    const { hasUnread } = useNotifications();
    const [profile, setProfile] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const [stats, setStats] = useState({
        total: 0,
        thisWeek: 0,
        thisMonth: 0,
        upcoming: 0,
        monthTrend: 0,
        weekTrend: 0,
        upcomingNext7Days: 0
    });
    const [copied, setCopied] = useState(false);

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
                    calculateStats(bookingsData);
                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [user]);

    const calculateStats = (data: Booking[]) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Start of current week (Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Start of current month
        const startOfMonth = new Date(currentYear, currentMonth, 1);

        // Start of last month
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfLastMonth = new Date(currentYear, currentMonth, 0);

        let total = 0;
        let week = 0;
        let month = 0;
        let lastMonth = 0;
        let upcoming = 0;
        let next7Days = 0;

        const sevenDaysFromNow = new Date(now);
        sevenDaysFromNow.setDate(now.getDate() + 7);

        data.forEach(booking => {
            if (booking.status === 'cancelled') return;

            total++;

            const bookingDate = booking.date instanceof Timestamp
                ? booking.date.toDate()
                : new Date(booking.date as any);

            if (bookingDate > now) {
                upcoming++;
                if (bookingDate <= sevenDaysFromNow) {
                    next7Days++;
                }
            }

            if (bookingDate >= startOfWeek) {
                week++;
            }

            if (bookingDate >= startOfMonth && bookingDate.getMonth() === currentMonth) {
                month++;
            }

            if (bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth) {
                lastMonth++;
            }
        });

        const monthTrend = lastMonth > 0 ? Math.round(((month - lastMonth) / lastMonth) * 100) : month * 100;

        setStats({
            total,
            thisWeek: week,
            thisMonth: month,
            upcoming,
            monthTrend,
            weekTrend: 0,
            upcomingNext7Days: next7Days
        });
    };

    const copyToClipboard = () => {
        if (profile?.username) {
            const link = `${window.location.origin}/${profile.username}`;
            navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const formatTime = (date: any) => {
        const d = date instanceof Timestamp ? date.toDate() : new Date(date);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(d);
    };

    const upcomingBookings = bookings
        .filter(b => b.status !== 'cancelled' && (b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date as any)) > new Date())
        .slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#6B5CE7] rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Modals */}
            <StatsModal
                isOpen={activeModal === 'total'}
                onClose={() => setActiveModal(null)}
                title="Total Bookings Calendar"
            >
                <BookingsCalendar bookings={bookings} />
            </StatsModal>

            <StatsModal
                isOpen={activeModal === 'week'}
                onClose={() => setActiveModal(null)}
                title="This Week's Activity"
            >
                <WeeklyChart bookings={bookings} />
            </StatsModal>

            <StatsModal
                isOpen={activeModal === 'month'}
                onClose={() => setActiveModal(null)}
                title="Month Summary"
            >
                <MonthSummary bookings={bookings} />
            </StatsModal>

            <StatsModal
                isOpen={activeModal === 'upcoming'}
                onClose={() => setActiveModal(null)}
                title="Upcoming Meetings"
            >
                <NotificationList bookings={bookings} />
            </StatsModal>

            {/* Welcome Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">👋</div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Welcome back, {user?.displayName?.split(' ')[0] || profile?.username || 'User'}!
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {formatDate(new Date())} • You have {stats.upcomingNext7Days > 0 ? stats.upcomingNext7Days : 'no'} meetings coming up this week
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    onClick={() => setActiveModal('total')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group hover:border-[#6B5CE7]/30"
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Total Bookings</span>
                        <div className="p-2 bg-[#6B5CE7]/10 text-[#6B5CE7] rounded-lg group-hover:bg-[#6B5CE7] group-hover:text-white transition-colors">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">{stats.total}</span>
                    </div>
                </div>

                <div
                    onClick={() => setActiveModal('week')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group hover:border-emerald-500/30"
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">This Week</span>
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <BarChart2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">{stats.thisWeek}</span>
                    </div>
                </div>

                <div
                    onClick={() => setActiveModal('month')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group hover:border-blue-500/30"
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">This Month</span>
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">{stats.thisMonth}</span>
                    </div>
                </div>

                <div
                    onClick={() => setActiveModal('upcoming')}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group hover:border-orange-500/30"
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Upcoming</span>
                        <div className="relative p-2 bg-orange-50 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            {hasUnread && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">{stats.upcoming}</span>
                    </div>
                </div>
            </div>

            {/* Booking Link */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#6B5CE7] text-white rounded-lg">
                        <LinkIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Your Booking Link</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-600 font-mono text-sm flex items-center">
                        <span className="text-slate-400 select-none mr-1">calendary.com/</span>
                        <span className="text-slate-900">{profile?.username || 'username'}</span>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="px-6 py-3 bg-[#6B5CE7] text-white font-medium rounded-xl hover:bg-[#5A4BD1] transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-200"
                    >
                        {copied ? <>Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                    </button>
                </div>
            </div>

            {/* Upcoming Meetings List */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Upcoming Meetings</h2>
                    <Link href="/dashboard/bookings" className="text-sm font-medium text-[#6B5CE7] hover:text-[#5A4BD1] flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="space-y-4">
                    {upcomingBookings.length > 0 ? (
                        upcomingBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#6B5CE7]/30 hover:bg-[#6B5CE7]/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#6B5CE7]/10 text-[#6B5CE7] flex items-center justify-center font-bold text-sm">
                                        {booking.guestName ? booking.guestName.charAt(0).toUpperCase() : 'G'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{booking.guestName || 'Guest'}</h3>
                                        <p className="text-sm text-slate-500">{booking.guestEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatTime(booking.date)}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {formatDate(booking.date instanceof Timestamp ? booking.date.toDate() : new Date(booking.date as any))}
                                    </div>
                                    {booking.meetingLink && (
                                        <Link
                                            href={booking.meetingLink}
                                            target="_blank"
                                            className="px-3 py-1.5 bg-[#6B5CE7] text-white text-xs font-medium rounded-lg hover:bg-[#5A4BD1] transition-colors flex items-center gap-1.5"
                                        >
                                            Join
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-slate-900 font-medium mb-1">No upcoming meetings</h3>
                            <p className="text-slate-500 text-sm">Convert your availability into bookings!</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
