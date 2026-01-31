"use client";

import { useState } from "react";
import {
    Calendar,
    Clock,
    Check,
    ChevronLeft,
    ChevronRight,
    Globe,
    Loader2,
    Copy,
    Link as LinkIcon,
    User
} from "lucide-react";
import { createBooking } from "@/lib/db";
import { Timestamp } from "firebase/firestore";

export default function BookingInterface({ profile }: { profile: any }) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [step, setStep] = useState<"date" | "form" | "success">("date");
    const [meetingLink, setMeetingLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Booking Form State
    const [guestName, setGuestName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock generating dates for the next 7 days
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i + 1); // Start from tomorrow
        return d;
    });

    const generateSlots = (date: Date) => {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        if (!profile.availability.days.includes(dayName)) return [];

        const startHour = parseInt(profile.availability.hours.start.split(":")[0]);
        const endHour = parseInt(profile.availability.hours.end.split(":")[0]);
        const slots = [];

        for (let h = startHour; h < endHour; h++) {
            slots.push(`${h}:00`);
            slots.push(`${h}:30`);
        }
        return slots;
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    const handleSlotSelect = (slot: string) => {
        setSelectedSlot(slot);
        setStep("form");
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!selectedDate || !selectedSlot) return;

        try {
            const [hours, minutes] = selectedSlot.split(':').map(Number);
            const bookingDate = new Date(selectedDate);
            bookingDate.setHours(hours, minutes);

            const { meetingLink } = await createBooking({
                hostId: profile.uid,
                guestName,
                guestEmail,
                notes,
                date: Timestamp.fromDate(bookingDate),
                duration: 30
            });

            setMeetingLink(meetingLink);
            setStep("success");
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Failed to create booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === "success") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
                    <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h2>
                <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm w-full text-left">
                    <div className="flex items-center gap-4 text-slate-700 font-medium">
                        <div className="p-2 bg-indigo-50 text-[#6B5CE7] rounded-lg">
                            <Calendar className="w-5 h-5" />
                        </div>
                        {selectedDate?.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-4 text-slate-700 font-medium mt-4">
                        <div className="p-2 bg-indigo-50 text-[#6B5CE7] rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        {selectedSlot} (30 mins)
                    </div>

                    {meetingLink && (
                        <div className="mt-6 space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase">Meeting Link</p>
                            <div className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <LinkIcon className="w-4 h-4 text-[#6B5CE7] flex-shrink-0" />
                                <a href={meetingLink} target="_blank" className="text-sm text-[#6B5CE7] font-semibold truncate hover:underline">
                                    {meetingLink}
                                </a>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(meetingLink);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-10 py-4 bg-[#6B5CE7] text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-[#5a4db8] transition-all w-full max-w-sm"
                >
                    Book Another Meeting
                </button>
                <a
                    href="/dashboard"
                    className="mt-4 text-sm font-bold text-slate-400 hover:text-[#6B5CE7] transition-colors"
                >
                    Go to Dashboard
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Left Sidebar: Mockup Style */}
            <div className="md:w-[320px] p-10 border-r border-slate-100 flex flex-col items-center md:items-start text-center md:text-left bg-slate-50/30">
                <div className="w-16 h-16 rounded-full bg-[#6B5CE7] text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-indigo-100 ring-4 ring-white">
                    {profile.displayName?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || "U"}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Book a meeting</p>
                <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
                    {profile.displayName || profile.username}
                </h1>
                <p className="text-slate-500 font-medium mt-1">30 Minute Meeting</p>

                <div className="mt-auto pt-10 space-y-4 w-full">
                    <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                        <Clock className="w-5 h-5 opacity-70" />
                        30 min
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                        <Globe className="w-5 h-5 opacity-70" />
                        {profile.availability.timezone?.replace(/_/g, " ") || "Asia/Calcutta"}
                    </div>
                </div>
            </div>

            {/* Right Logic Area */}
            <div className="flex-1 p-10 bg-white">
                {step === "date" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Center: Select a Date */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Select a Date</h2>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
                                    <button className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-slate-400" /></button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {dates.map((date, i) => {
                                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                                    const slots = generateSlots(date);
                                    const isAvailable = slots.length > 0;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => isAvailable && handleDateSelect(date)}
                                            disabled={!isAvailable}
                                            className={`
                                                w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all
                                                ${isSelected
                                                    ? "bg-indigo-50/50 border-[#6B5CE7] ring-1 ring-[#6B5CE7] shadow-sm"
                                                    : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm"
                                                }
                                                ${!isAvailable && "opacity-40 grayscale cursor-not-allowed"}
                                            `}
                                        >
                                            <span className={`font-bold ${isSelected ? "text-[#6B5CE7]" : "text-slate-700"}`}>
                                                {date.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </span>
                                            {isAvailable ? (
                                                <span className="text-[10px] font-bold text-[#6B5CE7] bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                                                    {slots.length} slots
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-400">Unavailable</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Availability */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900">Availability</h2>

                            {!selectedDate ? (
                                <div className="h-[432px] flex flex-col items-center justify-center p-8 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                        <Calendar className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 px-10">Select a date to view available time slots</p>
                                </div>
                            ) : (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="max-h-[432px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 gap-3">
                                        {generateSlots(selectedDate).map((slot, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSlotSelect(slot)}
                                                className="w-full py-4 text-center border-2 border-[#6B5CE7] text-[#6B5CE7] font-bold rounded-2xl hover:bg-[#6B5CE7] hover:text-white transition-all transform active:scale-[0.98]"
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Booking Form Step: Keeping it premium
                    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={() => setStep("date")}
                            className="flex items-center text-sm font-bold text-slate-400 hover:text-slate-900 mb-8 transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to calendar
                        </button>

                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Final Step</h2>
                        <p className="text-slate-500 mb-8">Tell us who you are to confirm your meeting.</p>

                        <div className="bg-[#6B5CE7] p-6 rounded-3xl shadow-xl shadow-indigo-100 mb-8 flex items-center justify-around text-white">
                            <div className="text-center">
                                <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Date</p>
                                <p className="text-sm font-extrabold">{selectedDate?.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</p>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div className="text-center">
                                <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Time</p>
                                <p className="text-sm font-extrabold">{selectedSlot}</p>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div className="text-center">
                                <p className="text-[10px] font-bold opacity-60 uppercase mb-1">Duration</p>
                                <p className="text-sm font-extrabold">30 min</p>
                            </div>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6B5CE7]/10 focus:border-[#6B5CE7] transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 transform rotate-45" />
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={guestEmail}
                                        onChange={(e) => setGuestEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6B5CE7]/10 focus:border-[#6B5CE7] transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Notes (Optional)</label>
                                <textarea
                                    placeholder="Anything else you'd like to share?"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#6B5CE7]/10 focus:border-[#6B5CE7] transition-all font-medium h-28 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#6B5CE7] text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-[#5a4db8] transition-all disabled:opacity-50 mt-4 active:scale-[0.98]"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Confirm Booking"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
