"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useGuest } from "@/components/GuestContext";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const { isGuest, exitGuestMode } = useGuest();

    const handleLogout = async () => {
        if (isGuest) {
            exitGuestMode();
        } else {
            await supabase.auth.signOut();
        }
        router.push("/login");
    };

    if (pathname === "/login") return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-espresso/5">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2">
                        <span className="text-gold text-xl">✦</span>
                        <span className="font-serif text-xl tracking-wide text-espresso group-hover:text-gold transition-colors duration-300">
                            Our Journey
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className={`text-sm tracking-wider uppercase transition-colors duration-300 ${pathname === "/"
                                    ? "text-gold"
                                    : "text-espresso/60 hover:text-espresso"
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/albums"
                            className={`text-sm tracking-wider uppercase transition-colors duration-300 ${pathname.startsWith("/albums")
                                    ? "text-gold"
                                    : "text-espresso/60 hover:text-espresso"
                                }`}
                        >
                            Albums
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-sm tracking-wider uppercase text-espresso/40 hover:text-espresso transition-colors duration-300"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
