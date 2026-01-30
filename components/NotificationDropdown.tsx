import { Booking } from "@/lib/db";
import { Timestamp } from "firebase/firestore";
import { Clock, Video } from "lucide-react";
import Link from "next/link";

interface NotificationDropdownProps {
    notifications: Booking[];
    onClose: () => void;
}

export default function NotificationDropdown({ notifications, onClose }: NotificationDropdownProps) {
    const formatTime = (date: any) => {
        const d = date instanceof Timestamp ? date.toDate() : new Date(date);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(d);
    };

    const getTimeUntil = (date: any) => {
        const now = new Date();
        const meetingDate = date instanceof Timestamp ? date.toDate() : new Date(date);
        const diffMs = meetingDate.getTime() - now.getTime();
        const diffMins = Math.ceil(diffMs / (1000 * 60));

        if (diffMins < 1) return "Starting now";
        return `Starts in ${diffMins} min`;
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                    {notifications.length}
                </span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {notifications.map((booking) => (
                            <div key={booking.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            Meeting with {booking.guestName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-[#6B5CE7] font-medium">
                                            <Clock className="w-3 h-3" />
                                            {getTimeUntil(booking.date)}
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500">
                                            {formatTime(booking.date)}
                                        </div>

                                        {booking.meetingLink && (
                                            <Link
                                                href={booking.meetingLink}
                                                target="_blank"
                                                className="mt-3 block w-full text-center py-2 bg-[#6B5CE7]/10 text-[#6B5CE7] rounded-lg text-xs font-bold hover:bg-[#6B5CE7]/20 transition-colors"
                                                onClick={onClose}
                                            >
                                                Join Meeting
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-500">No upcoming meetings</p>
                        <p className="text-xs text-slate-400 mt-1">We'll notify you 15 mins before</p>
                    </div>
                )}
            </div>
        </div>
    );
}
