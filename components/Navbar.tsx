import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-[#6B5CE7] tracking-tight">
                            Calendary
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-slate-600 hover:text-[#6B5CE7] transition-colors font-medium">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-slate-600 hover:text-[#6B5CE7] transition-colors font-medium">
                            How it Works
                        </Link>
                        <Link href="#pricing" className="text-slate-600 hover:text-[#6B5CE7] transition-colors font-medium">
                            Pricing
                        </Link>
                        <Link href="/login" className="text-slate-900 hover:text-[#6B5CE7] transition-colors font-medium">
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-[#5C9CE7] hover:bg-[#4a8ad4] text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
                        >
                            Get started
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button className="text-text-body hover:text-primary p-2">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
