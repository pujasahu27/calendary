"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    UserCredential,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    AuthError
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, username: string) => Promise<UserCredential>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            setError((error as AuthError).message);
            throw error;
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error signing in with Email", error);
            setError((error as AuthError).message);
            throw error;
        }
    }

    const signUpWithEmail = async (email: string, password: string, username: string): Promise<UserCredential> => {
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: username
            });
            // Force user refresh to get the display name
            setUser({ ...userCredential.user, displayName: username });
            return userCredential;
        } catch (error) {
            console.error("Error signing up", error);
            setError((error as AuthError).message);
            throw error;
        }
    }

    const logout = async () => {
        setError(null);
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
            setError((error as AuthError).message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
