"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

function isGuestMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim() === "guest-mode=true");
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check guest mode first (uses cookie)
    if (isGuestMode()) {
      setIsAuthenticated(true);
      setIsChecking(false);
      if (pathname === "/login") {
        router.push("/");
      }
      return;
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setIsChecking(false);
      } else {
        setIsAuthenticated(false);
        setIsChecking(false);
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  async function checkAuth() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setIsAuthenticated(true);
      if (pathname === "/login") {
        router.push("/");
        return;
      }
    } else {
      setIsAuthenticated(false);
      if (pathname !== "/login") {
        router.push("/login");
        return;
      }
    }

    setIsChecking(false);
  }

  // Always show login page without loading state
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center animate-fade-in">
          <span className="text-gold text-2xl block mb-4">✦</span>
          <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Not authenticated → don't render protected content
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
