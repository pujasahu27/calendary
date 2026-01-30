import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-transparent pt-16 pb-32 lg:pt-24 lg:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
                        Booking made <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B5CE7] to-[#5C9CE7]">simple</span> for everyone.
                    </h1>
                    <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Eliminate the back-and-forth emails. Schedule meetings, manage availability, and get booked with ease.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/signup"
                            className="px-8 py-4 bg-[#6B5CE7] hover:bg-[#5a4bd1] text-white text-lg font-bold rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group ring-2 ring-transparent hover:ring-[#E9D5FF]"
                        >
                            Start for free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="px-8 py-4 bg-white text-slate-800 border border-slate-200 text-lg font-bold rounded-full hover:border-[#6B5CE7] hover:bg-slate-50 transition-all shadow-sm"
                        >
                            How it works
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                {/* Animated Grid */}
                <div
                    className="absolute inset-0 z-0 animate-grid-pattern opacity-[0.4]"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(107, 92, 231, 0.1) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(107, 92, 231, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 z-0" /> {/* Fade out at bottom */}

                {/* Blobs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E9D5FF] rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#BFDBFE] rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
            </div>
        </div>
    );
}
