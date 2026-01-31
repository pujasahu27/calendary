import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, orderBy, updateDoc, addDoc, Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    const usernameRef = doc(db, "usernames", username);
    const usernameSnap = await getDoc(usernameRef);
    return !usernameSnap.exists();
}

export async function createUserDocument(user: User, username: string) {
    // 1. Create User Document
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        uid: user.uid,
        username: username,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        availability: {
            // Default availability: Mon-Fri, 9am-5pm
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            hours: { start: "09:00", end: "17:00" },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        onboardingComplete: true,
        welcomeMessage: "Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.",
        language: "English",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "12h (am/pm)",
        country: "India",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        // Advanced Scheduling Settings
        settings: {
            bufferBefore: 15, // minutes
            bufferAfter: 15, // minutes
            limitPerDay: 5,
            limitPerWeek: 20,
            minNoticeTime: 24, // hours
            defaultLocation: "Google Meet",
            defaultInstructions: "A calendar invitation with a video link will be sent to your email address.",
            vacationMode: false,
            emailReminders: true,
            reminderLeadTime: 24 // hours
        }
    });

    // 2. Reserve Username
    const usernameRef = doc(db, "usernames", username);
    await setDoc(usernameRef, {
        uid: user.uid
    });
}

export async function getUserProfile(uid: string) {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data();
    }
    return null;
}

export async function getUserByUsername(username: string) {
    const usernameRef = doc(db, "usernames", username);
    const usernameSnap = await getDoc(usernameRef);
    if (!usernameSnap.exists()) return null;

    const { uid } = usernameSnap.data();
    return getUserProfile(uid);
}

export type Booking = {
    id: string;
    hostId: string;
    guestName: string;
    guestEmail: string;
    notes: string;
    date: Timestamp;
    duration: number;
    status: 'confirmed' | 'cancelled' | 'completed';
    createdAt: Timestamp;
    meetingLink?: string;
}

export async function createBooking(bookingData: Omit<Booking, "id" | "createdAt" | "status" | "meetingLink">) {
    const bookingsRef = collection(db, "bookings");

    // Generate a mock unique meeting link
    const uniqueId = Math.random().toString(36).substring(2, 11); // e.g. "a1b2c3d4e"
    // Format: meet.google.com/abc-defg-hij
    const meetingLink = `https://meet.google.com/${uniqueId.slice(0, 3)}-${uniqueId.slice(3, 7)}-${uniqueId.slice(7, 10)}`;

    const docRef = await addDoc(bookingsRef, {
        ...bookingData,
        status: 'confirmed',
        meetingLink,
        createdAt: serverTimestamp()
    });
    return { id: docRef.id, meetingLink };
}

export async function getBookingsForHost(hostId: string) {
    const bookingsRef = collection(db, "bookings");
    const q = query(
        bookingsRef,
        where("hostId", "==", hostId),
        orderBy("date", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Booking[];
}

export async function cancelBooking(bookingId: string) {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
        status: 'cancelled'
    });
}

export async function updateAvailability(uid: string, availability: any) {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        availability: availability
    }, { merge: true });
}

export async function updateUserProfile(uid: string, data: any) {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data, { merge: true });
}
