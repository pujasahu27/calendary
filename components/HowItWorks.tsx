import { Calendar, Link as LinkIcon, CheckCircle } from "lucide-react";

const steps = [
    {
        icon: Calendar,
        title: "Create your link",
        description: "Connect your calendar and define your availability preferences.",
    },
    {
        icon: LinkIcon,
        title: "Share your link",
        description: "Send your personalized booking link to guests via email or message.",
    },
    {
        icon: CheckCircle,
        title: "Get booked",
        description: "Guests pick a time, and the meeting is added to your calendar instantly.",
    },
];

export default function HowItWorks() {
    return (
        <div id="how-it-works" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-heading mb-4">
                        How it works
                    </h2>
                    <p className="text-lg text-text-body max-w-2xl mx-auto">
                        Three simple steps to reclaim your time and streamline your schedule.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
                    {/* Connector Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center group">
                            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow relative">
                                <div className="absolute inset-0 bg-[#6B5CE7]/5 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform" />
                                <step.icon className="w-10 h-10 text-[#6B5CE7] relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-text-heading mb-2">{step.title}</h3>
                            <p className="text-text-body leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
