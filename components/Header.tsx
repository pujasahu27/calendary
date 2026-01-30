import { Bell, Settings } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
    const { notifications, hasUnread, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleNotifications = () => {
        if (!isOpen) {
            markAsRead();
        }
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex justify-end items-center gap-3 mb-8">
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleNotifications}
                    className={`p-3 rounded-2xl transition-all duration-200 ${isOpen || hasUnread
                            ? "bg-orange-50 text-orange-500 shadow-sm shadow-orange-100 ring-2 ring-orange-100"
                            : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 shadow-sm"
                        }`}
                >
                    <Bell className="w-5 h-5" />
                    {hasUnread && notifications.length > 0 && (
                        <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                </button>

                {isOpen && (
                    <NotificationDropdown
                        notifications={notifications}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </div>

            <Link
                href="/dashboard/settings"
                className="p-3 bg-white text-slate-500 rounded-2xl hover:bg-slate-50 border border-slate-100 shadow-sm transition-all"
            >
                <Settings className="w-5 h-5" />
            </Link>
        </div>
    );
}
