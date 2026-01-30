"use client";

import { useAuth } from "@/context/AuthContext";

export default function Login() {
    const { user, signInWithGoogle, logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-4 border rounded-lg shadow-sm">
            {user ? (
                <div className="flex flex-col items-center gap-2">
                    <p className="font-medium">Welcome, {user.displayName}</p>
                    <button
                        onClick={logout}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <button
                    onClick={signInWithGoogle}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Sign in with Google
                </button>
            )}
        </div>
    );
}
