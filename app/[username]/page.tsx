import { getUserByUsername } from "@/lib/db";
import { notFound } from "next/navigation";
import BookingInterface from "@/components/BookingInterface";

export default async function PublicBookingPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const profile = await getUserByUsername(username);

    if (!profile) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px]">
                <BookingInterface profile={JSON.parse(JSON.stringify(profile))} />
            </div>
        </div>
    );
}
