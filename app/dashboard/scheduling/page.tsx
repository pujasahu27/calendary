"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/db";
import { useEffect, useState } from "react";
import BookingInterface from "@/components/BookingInterface";

export default function SchedulingPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.uid) {
                const data = await getUserProfile(user.uid);
                setProfile(data);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#6B5CE7] rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-slate-100 min-h-[600px]">
                <BookingInterface profile={profile} />
            </div>
        </div>
    );
}
