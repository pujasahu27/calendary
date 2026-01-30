"use client";

import Link from "next/link";
import { LayoutDashboard, Clock, Settings, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/db";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [checkingOnboarding, setCheckingOnboarding] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (!loading && !user) {
                router.push("/login");
            } else if (user) {
                // Check if onboarding is complete
                const profile = await getUserProfile(user.uid);
                if (!profile?.onboardingComplete) {
                    router.push("/onboarding");
                } else {
                    setCheckingOnboarding(false);
                }
            }
        };
        checkAuth();
    }, [user, loading, router]);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", exact: true },
        { href: "/dashboard/bookings", icon: LayoutDashboard, label: "Bookings", exact: false },
        { href: "/dashboard/availability", icon: Clock, label: "Availability", exact: false },
        { href: "/dashboard/profile", icon: UserIcon, label: "Profile", exact: false },
        { href: "/dashboard/settings", icon: Settings, label: "Settings", exact: false },
    ];

    if (loading || checkingOnboarding) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-8 h-8 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-[#F8F9FA]">
            {/* Sidebar */}
            <aside className="w-64 bg-white flex flex-col fixed h-full z-10 hidden md:flex rounded-r-[30px] my-4 ml-4 h-[calc(100vh-32px)] shadow-xl overflow-hidden">
                <div className="p-6">
                    <Link href="/dashboard" className="text-2xl font-bold text-[#6C5DD3] tracking-tight flex items-center gap-2">
                        <div className="p-1.5 bg-[#6C5DD3] rounded-lg">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        Calendary
                    </Link>
                </div>

                <div className="px-6 pb-6">
                    <div className="bg-[#6C5DD3] rounded-2xl p-4 text-white shadow-lg shadow-indigo-200">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold mb-3 border border-white/30">
                            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                        </div>
                        <p className="font-bold truncate">{user?.displayName || "User"}</p>
                        <p className="text-xs text-indigo-200 truncate">{user?.email}</p>
                    </div>
                </div>

                <div className="px-6 mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Main Menu</p>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                    ? "bg-[#6C5DD3] text-white shadow-md shadow-indigo-200 translate-x-1"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                {item.label}
                                {item.label === "My Bookings" && (
                                    <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">5</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                    <p className="text-xs text-slate-300 text-center mt-4">v1.0.0</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-[280px] p-8 overflow-y-auto w-full mr-4 my-4 rounded-[30px] bg-[#6C5DD3]/0">
                {children}
            </main>
        </div>
    );
}
