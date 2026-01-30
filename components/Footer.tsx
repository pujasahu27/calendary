import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-background py-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-2xl font-bold text-primary tracking-tight">Calendary</span>
                        <p className="text-sm text-text-body mt-2">© 2026 Calendary Inc. All rights reserved.</p>
                    </div>

                    <div className="flex space-x-8">
                        <Link href="#" className="text-text-body hover:text-primary transition-colors hover:underline">
                            Terms
                        </Link>
                        <Link href="#" className="text-text-body hover:text-primary transition-colors hover:underline">
                            Privacy
                        </Link>
                        <Link href="#" className="text-text-body hover:text-primary transition-colors hover:underline">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
