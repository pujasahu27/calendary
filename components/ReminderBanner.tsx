import { useNotifications } from "@/hooks/useNotifications";
import { Clock } from "lucide-react";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";

export default function ReminderBanner() {
    const { notifications, hasUnread } = useNotifications();

    if (!hasUnread || notifications.length === 0) return null;

    const nextMeeting = notifications[0];
    const meetingDate = nextMeeting.date instanceof Timestamp
        ? nextMeeting.date.toDate()
        : new Date(nextMeeting.date as any);

    // Calculate minutes until
    const now = new Date();
    const diffMs = meetingDate.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / (1000 * 60));

    return (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900">Meeting starting soon</h3>
                    <p className="text-sm text-slate-600">
                        With {nextMeeting.guestName} in <span className="font-bold text-orange-600">{diffMins} mins</span>
                    </p>
                </div>
            </div>
            {nextMeeting.meetingLink && (
                <Link
                    href={nextMeeting.meetingLink}
                    target="_blank"
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                >
                    Join Now
                </Link>
            )}
        </div>
    );
}
