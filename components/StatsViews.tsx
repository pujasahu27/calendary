import { Booking } from "@/lib/db";
import { Timestamp } from "firebase/firestore";
import { Calendar, CheckCircle2, Clock, User } from "lucide-react";
import Link from "next/link";

interface ViewProps {
    bookings: Booking[];
}

// Helper: Get bookings for a specific date
const getBookingsForDate = (bookings: Booking[], date: Date) => {
    return bookings.filter(booking => {
        if (booking.status === 'cancelled') return false;
        const bDate = booking.date instanceof Timestamp ? booking.date.toDate() : new Date(booking.date as any);
        return bDate.getDate() === date.getDate() &&
            bDate.getMonth() === date.getMonth() &&
            bDate.getFullYear() === date.getFullYear();
    });
};

export function BookingsCalendar({ bookings }: ViewProps) {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const empties = Array.from({ length: firstDay }, (_, i) => i);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">
                    {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-[#6B5CE7]" /> Has Booking
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="py-2 text-slate-400 font-medium">{d}</div>
                ))}
                {empties.map(e => <div key={`empty-${e}`} />)}
                {days.map(day => {
                    const date = new Date(now.getFullYear(), now.getMonth(), day);
                    const dayBookings = getBookingsForDate(bookings, date);
                    const hasBooking = dayBookings.length > 0;
                    const isToday = day === now.getDate();

                    return (
                        <div
                            key={day}
                            className={`
                                aspect-square flex items-center justify-center rounded-lg text-sm relative
                                ${isToday ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600'}
                                ${hasBooking ? 'bg-[#6B5CE7]/10 text-[#6B5CE7] font-bold ring-1 ring-[#6B5CE7]/20' : ''}
                            `}
                        >
                            {day}
                            {hasBooking && (
                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#6B5CE7]" />
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Bookings this month: {bookings.length}</h4>
            </div>
        </div>
    );
}

export function WeeklyChart({ bookings }: ViewProps) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    const data = weekDays.map(day => ({
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        count: getBookingsForDate(bookings, day).length,
        isToday: day.getDate() === now.getDate()
    }));

    const maxCount = Math.max(...data.map(d => d.count), 1); // Avoid div by zero

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-2 h-48 pt-4">
                {data.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div
                            className="w-full rounded-t-lg transition-all duration-500 relative group-hover:opacity-80"
                            style={{
                                height: `${(item.count / maxCount) * 100}%`,
                                backgroundColor: item.isToday ? '#6B5CE7' : 'rgba(107, 92, 231, 0.2)'
                            }}
                        >
                            {item.count > 0 && (
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-[#6B5CE7]">
                                    {item.count}
                                </span>
                            )}
                        </div>
                        <span className={`text-xs font-medium uppercase ${item.isToday ? 'text-[#6B5CE7]' : 'text-slate-400'}`}>
                            {item.day}
                        </span>
                    </div>
                ))}
            </div>
            <div className="text-center text-sm text-slate-500">
                Total bookings this week: <span className="font-bold text-[#6B5CE7]">{data.reduce((a, b) => a + b.count, 0)}</span>
            </div>
        </div >
    );
}

export function MonthSummary({ bookings }: ViewProps) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const monthBookings = bookings.filter(b => {
        const d = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date as any);
        return d.getMonth() === currentMonth && d.getFullYear() === now.getFullYear();
    });

    const totalDuration = monthBookings.reduce((acc, curr) => acc + (curr.duration || 30), 0);
    const guests = new Set(monthBookings.map(b => b.guestEmail)).size;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-blue-500 mb-2"><Calendar className="w-5 h-5" /></div>
                    <div className="text-2xl font-bold text-slate-900">{monthBookings.length}</div>
                    <div className="text-xs text-slate-500">Total Sessions</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl">
                    <div className="text-indigo-500 mb-2"><Clock className="w-5 h-5" /></div>
                    <div className="text-2xl font-bold text-slate-900">{Math.round(totalDuration / 60)}h</div>
                    <div className="text-xs text-slate-500">Total Hours</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl col-span-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-purple-500">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-slate-900">{guests}</div>
                            <div className="text-xs text-slate-500">Unique Guests</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function NotificationList({ bookings }: ViewProps) {
    const now = new Date();
    // Filter only upcoming
    const upcoming = bookings
        .filter(b => {
            const d = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date as any);
            return d > now && b.status !== 'cancelled';
        })
        .sort((a, b) => {
            const da = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date as any);
            const db = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date as any);
            return da.getTime() - db.getTime();
        });

    if (upcoming.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-slate-500">No upcoming meetings</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {upcoming.map(booking => {
                const date = booking.date instanceof Timestamp ? booking.date.toDate() : new Date(booking.date as any);
                const diffMins = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60));
                const startingSoon = diffMins <= 15;

                return (
                    <div key={booking.id} className={`p-4 rounded-xl border transition-all ${startingSoon ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-100'
                        }`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-semibold text-slate-900">{booking.guestName}</h4>
                                <p className="text-sm text-slate-500">{date.toLocaleString()}</p>
                            </div>
                            {startingSoon && (
                                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                    Starts in {diffMins}m
                                </span>
                            )}
                        </div>
                        {booking.meetingLink && (
                            <Link
                                href={booking.meetingLink}
                                target="_blank"
                                className="mt-3 block text-center py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                Join Meeting
                            </Link>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
