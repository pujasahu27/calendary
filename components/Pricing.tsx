import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
    {
        name: "Free",
        id: "tier-free",
        price: "$0",
        description: "Perfect for individuals just starting out.",
        features: ["1 Event Type", "Google Calendar Sync", "Unlimited Bookings", "Automated Emails"],
        cta: "Sign up for free",
        mostPopular: false,
    },
    {
        name: "Pro",
        id: "tier-pro",
        price: "$12",
        description: "For professionals who need more power.",
        features: [
            "Unlimited Event Types",
            "Multiple Calendars",
            "Remove Branding",
            "Group Events",
            "Email Customization",
        ],
        cta: "Start 14-day trial",
        mostPopular: true,
    },
    {
        name: "Teams",
        id: "tier-teams",
        price: "$29",
        description: "Collaboration tools for growing teams.",
        features: [
            "Everything in Pro",
            "Admin Analytics",
            "Round Robin Assignment",
            "SSO & Security",
            "Priority Support",
        ],
        cta: "Contact Sales",
        mostPopular: false,
    },
];

export default function Pricing() {
    return (
        <div id="pricing" className="py-24 bg-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-[#E9D5FF]/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-[#BFDBFE]/30 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#6B5CE7] font-bold tracking-wider uppercase text-sm">Pricing</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-2 mb-6">
                        Simple, transparent pricing.
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`rounded-3xl p-8 ring-1 transition-all duration-300 relative flex flex-col ${tier.mostPopular
                                    ? "ring-[#6B5CE7] shadow-xl bg-white scale-105 z-10"
                                    : "ring-slate-200 shadow-sm bg-white/60 hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            {tier.mostPopular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#6B5CE7] to-[#5C9CE7] text-white text-sm font-bold rounded-full shadow-md">
                                    Most Popular
                                </span>
                            )}

                            <h3 className={`text-2xl font-bold ${tier.mostPopular ? "text-[#6B5CE7]" : "text-slate-900"}`}>
                                {tier.name}
                            </h3>
                            <p className="mt-4 text-slate-600 text-sm leading-6 min-h-[48px]">
                                {tier.description}
                            </p>
                            <div className="mt-6 flex items-baseline gap-x-1">
                                <span className="text-4xl font-bold tracking-tight text-slate-900">{tier.price}</span>
                                <span className="text-sm font-semibold leading-6 text-slate-600">/month</span>
                            </div>

                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex gap-x-3">
                                        <Check className={`h-6 w-5 flex-none ${tier.mostPopular ? "text-[#6B5CE7]" : "text-slate-400"}`} aria-hidden="true" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/signup"
                                className={`mt-8 block rounded-full px-3 py-3 text-center text-sm font-bold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all shadow-sm ${tier.mostPopular
                                        ? "bg-[#6B5CE7] text-white hover:bg-[#5a4bd1] focus-visible:outline-[#6B5CE7] shadow-md hover:shadow-lg"
                                        : "bg-white text-[#6B5CE7] ring-1 ring-inset ring-[#6B5CE7] hover:bg-[#6B5CE7] hover:text-white"
                                    }`}
                            >
                                {tier.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
