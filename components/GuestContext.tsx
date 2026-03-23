"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type GuestContextType = {
  isGuest: boolean;
};

const GuestContext = createContext<GuestContextType>({ isGuest: false });

export function useGuest() {
  return useContext(GuestContext);
}

const GUEST_EMAIL = "guest@ourjourney.app";

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkIfGuest();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsGuest(session?.user?.email === GUEST_EMAIL);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkIfGuest() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setIsGuest(user?.email === GUEST_EMAIL);
  }

  return (
    <GuestContext.Provider value={{ isGuest }}>
      {children}
    </GuestContext.Provider>
  );
}
