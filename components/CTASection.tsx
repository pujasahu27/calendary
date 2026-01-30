import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <div className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                    Ready to simplify your scheduling?
                </h2>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                    Join thousands of professionals who trust Calendary to manage their time efficiently.
                </p>
                <div className="flex justify-center">
                    <Link
                        href="/signup"
                        className="px-10 py-5 bg-[#5C9CE7] text-white text-xl font-bold rounded-full hover:bg-[#4a8ad4] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 group"
                    >
                        Get Started for Free
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
