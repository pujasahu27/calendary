import { Clock, Globe, Shield, CalendarCheck, Users, Zap } from "lucide-react";

const features = [
    {
        icon: Clock,
        title: "Availability Control",
        description: "Set specific days, hours, and buffer times between meetings. You're in charge.",
    },
    {
        icon: Globe,
        title: "Timezone Detection",
        description: "We automatically detect your guest's timezone so everyone meets at the right time.",
    },
    {
        icon: Shield,
        title: "Conflict Prevention",
        description: "Never worry about double bookings. We check your calendar for conflicts.",
    },
    {
        icon: CalendarCheck,
        title: "Automated Reminders",
        description: "Reduce no-shows with automated email confirmations and reminders for your guests.",
    },
    {
        icon: Users,
        title: "Group Events",
        description: "Book multiple people for one time slot, perfect for webinars and training sessions.",
    },
    {
        icon: Zap,
        title: "Seamless Integrations",
        description: "Connect with Google Calendar, Outlook, and your favorite video conferencing tools.",
    },
];

export default function Features() {
    return (
        <div id="features" className="py-24 bg-transparent border-t border-slate-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#6B5CE7] font-bold tracking-wider uppercase text-sm">Features</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-2 mb-6">
                        Everything you need to schedule smarter.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow hover:border-[#6B5CE7]/30">
                            <div className="w-12 h-12 bg-[#6B5CE7]/10 rounded-xl flex items-center justify-center mb-6 text-[#6B5CE7]">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Visual Demo Placeholder - Abstract Calendar Grid */}
                <div className="mt-20 relative p-8 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-4xl mx-auto overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6B5CE7]/5 to-[#5C9CE7]/5 opacity-50" />
                    <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
                        <div className="space-y-4 max-w-md">
                            <h3 className="text-2xl font-bold text-slate-900">Seamless Booking Experience</h3>
                            <p className="text-slate-600">Your guests see a clean, professional booking page that works on any device.</p>
                        </div>
                        {/* Visual Representation of availability */}
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 w-full max-w-sm">
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-semibold text-slate-900">January 2026</div>
                                <div className="flex gap-1">
                                    <div className="w-6 h-6 rounded-full bg-gray-100" />
                                    <div className="w-6 h-6 rounded-full bg-gray-100" />
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => <div key={i} className="text-xs text-center text-gray-400 font-medium">{day}</div>)}
                                {[...Array(28)].map((_, i) => (
                                    <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-xs ${i === 14 ? 'bg-[#6B5CE7] text-white font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <div className="h-8 flex-1 bg-[#5C9CE7]/10 rounded-md border border-[#5C9CE7]/20 flex items-center justify-center text-[#5C9CE7] text-xs font-medium">9:00 AM</div>
                                <div className="h-8 flex-1 bg-white rounded-md border border-gray-200 flex items-center justify-center text-gray-500 text-xs hover:border-[#6B5CE7]/50 cursor-pointer">10:00 AM</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
