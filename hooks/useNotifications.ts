import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getBookingsForHost, Booking } from '@/lib/db';
import { Timestamp } from 'firebase/firestore';

export function useNotifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Booking[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const checkNotifications = async () => {
            try {
                const allBookings = await getBookingsForHost(user.uid);
                const now = new Date();

                // Filter for upcoming meetings
                const upcoming = allBookings.filter(booking => {
                    if (booking.status === 'cancelled') return false;

                    const bookingDate = booking.date instanceof Timestamp
                        ? booking.date.toDate()
                        : new Date(booking.date as any);

                    // Check if meeting is in the future
                    if (bookingDate <= now) return false;

                    // Check if meeting is starting within 15 minutes
                    const diffInMinutes = (bookingDate.getTime() - now.getTime()) / (1000 * 60);
                    return diffInMinutes <= 15;
                });

                setNotifications(upcoming);
                setHasUnread(upcoming.length > 0);
            } catch (error) {
                console.error("Error checking notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        // Check initially
        checkNotifications();

        // Check every minute
        const intervalId = setInterval(checkNotifications, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [user]);

    const markAsRead = () => {
        setHasUnread(false);
    };

    return {
        notifications,
        hasUnread,
        loading,
        markAsRead,
        refresh: () => setLoading(true) // Trigger a re-run logic if needed, simplistically just exposing state
    };
}
