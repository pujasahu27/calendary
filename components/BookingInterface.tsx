"use client";

import { useState } from "react";
import { Calendar, Clock, Check, ChevronLeft, ChevronRight, Globe, Loader2, Copy, Link as LinkIcon } from "lucide-react";
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

    // Mock generating slots based on profile availability
    // In a real app, this would check against existing bookings in DB
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
            // Parse the selectedSlot (e.g. "10:30") and combine with selectedDate
            const [hours, minutes] = selectedSlot.split(':').map(Number);
            const bookingDate = new Date(selectedDate);
            bookingDate.setHours(hours, minutes);

            const { meetingLink } = await createBooking({
                hostId: profile.uid,
                guestName,
                guestEmail,
                notes,
                date: Timestamp.fromDate(bookingDate),
                duration: 30 // hardcoded for now
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
            <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h2>
                <p className="text-slate-500 mt-2">
                    You are scheduled with <span className="font-semibold">{profile.displayName}</span> on
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 inline-block text-left">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <Calendar className="w-4 h-4 text-[#6B5CE7]" />
                        {selectedDate?.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 mt-2">
                        <Clock className="w-4 h-4 text-[#6B5CE7]" />
                        {selectedSlot} - {selectedSlot?.split(":")[0]}:{(parseInt(selectedSlot?.split(":")[1] || "0") + 30).toString().padStart(2, '0') || "00"}
                    </div>
                    {/* Note: In a real app we'd fetch the created booking to show the link, 
                        or generate it client-side. For now, the host sees it in their dashboard. */}
                    {meetingLink && (
                        <div className="flex items-center justify-between gap-3 text-sm text-slate-700 mt-3 p-2 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <LinkIcon className="w-4 h-4 text-[#6B5CE7] flex-shrink-0" />
                                <a href={meetingLink} target="_blank" className="text-[#6B5CE7] underline truncate hover:text-[#5a4db8] transition-colors">
                                    {meetingLink}
                                </a>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(meetingLink);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-700 transition-colors"
                                title="Copy link"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    Book Another
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-full">
            {/* Left Sidebar: Host Info */}
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 p-6 md:p-8 bg-slate-50/50">
                <div className="flex flex-col h-full">
                    <div className="mb-6">
                        {profile.photoURL ? (
                            <img src={profile.photoURL} alt={profile.displayName} className="w-16 h-16 rounded-full object-cover mb-4 shadow-sm" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-[#6B5CE7] text-white flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
                                {profile.displayName?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Book a meeting</p>
                        <h1 className="text-2xl font-bold text-slate-900 mt-1">{profile.displayName}</h1>
                        <p className="text-slate-500 text-sm mt-1">30 Minute Meeting</p>
                    </div>

                    <div className="space-y-4 mt-auto">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            30 min
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Globe className="w-4 h-4" />
                            {profile.availability.timezone?.replace(/_/g, " ") || "UTC"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Calendar & Form */}
            <div className="md:w-2/3 p-6 md:p-8 overflow-y-auto">
                {step === "date" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                        {/* Date Picker (Custom Simple Grid) */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-900">Select a Date</h3>
                                <div className="flex gap-1">
                                    <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
                                    <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="w-5 h-5 text-slate-400" /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
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
                                                flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm
                                                ${isSelected
                                                    ? "bg-[#6B5CE7]/5 border-[#6B5CE7] ring-1 ring-[#6B5CE7]"
                                                    : "bg-white border-slate-200 hover:border-[#6B5CE7] hover:shadow-sm"
                                                }
                                                ${!isAvailable && "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100"}
                                            `}
                                        >
                                            <span className={`font-medium ${isSelected ? "text-[#6B5CE7]" : "text-slate-700"}`}>
                                                {date.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </span>
                                            {isAvailable ? (
                                                <span className="text-xs text-[#6B5CE7] font-medium bg-[#6B5CE7]/10 px-2 py-1 rounded-md">
                                                    {slots.length} slots
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">Unavailable</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Slots */}
                        <div className="h-full">
                            <h3 className="font-semibold text-slate-900 mb-4">
                                {selectedDate
                                    ? selectedDate.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })
                                    : "Availability"
                                }
                            </h3>

                            {!selectedDate ? (
                                <div className="flex items-center justify-center h-48 text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    Select a date to view times
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
                                    {generateSlots(selectedDate).map((slot, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSlotSelect(slot)}
                                            className="w-full py-3 text-center border border-[#6B5CE7] text-[#6B5CE7] font-medium rounded-lg hover:bg-[#6B5CE7] hover:text-white transition-colors"
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Booking Form Step
                    <div className="max-w-md mx-auto animate-in slide-in-from-right duration-300">
                        <button
                            onClick={() => setStep("date")}
                            className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to calendar
                        </button>

                        <h2 className="text-xl font-bold text-slate-900 mb-6">Enter Details</h2>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex gap-4">
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Date</p>
                                <p className="text-sm font-medium text-slate-900">{selectedDate?.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Time</p>
                                <p className="text-sm font-medium text-slate-900">{selectedSlot} (30 min)</p>
                            </div>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Name</label>
                                <input
                                    type="text"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5CE7] focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5CE7] focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B5CE7] focus:border-transparent h-24 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-[#6B5CE7] text-white font-semibold rounded-xl hover:bg-[#5a4db8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {isSubmitting ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span> : "Confirm Booking"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
