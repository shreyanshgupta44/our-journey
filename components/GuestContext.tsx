"use client";

import { createContext, useContext, useEffect, useState } from "react";

type GuestContextType = {
  isGuest: boolean;
  enterGuestMode: () => void;
  exitGuestMode: () => void;
};

const GuestContext = createContext<GuestContextType>({
  isGuest: false,
  enterGuestMode: () => {},
  exitGuestMode: () => {},
});

export function useGuest() {
  return useContext(GuestContext);
}

const GUEST_KEY = "our-journey-guest";

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if guest mode was previously set
    setIsGuest(sessionStorage.getItem(GUEST_KEY) === "true");
  }, []);

  function enterGuestMode() {
    sessionStorage.setItem(GUEST_KEY, "true");
    setIsGuest(true);
  }

  function exitGuestMode() {
    sessionStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
  }

  return (
    <GuestContext.Provider value={{ isGuest, enterGuestMode, exitGuestMode }}>
      {children}
    </GuestContext.Provider>
  );
}
