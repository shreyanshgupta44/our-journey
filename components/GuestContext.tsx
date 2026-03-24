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

function setGuestCookie(value: boolean) {
  if (value) {
    document.cookie = "guest-mode=true; path=/; max-age=86400; SameSite=Lax";
  } else {
    document.cookie = "guest-mode=; path=/; max-age=0; SameSite=Lax";
  }
}

function getGuestCookie(): boolean {
  return document.cookie.split(";").some((c) => c.trim() === "guest-mode=true");
}

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setIsGuest(getGuestCookie());
  }, []);

  function enterGuestMode() {
    setGuestCookie(true);
    setIsGuest(true);
  }

  function exitGuestMode() {
    setGuestCookie(false);
    setIsGuest(false);
  }

  return (
    <GuestContext.Provider value={{ isGuest, enterGuestMode, exitGuestMode }}>
      {children}
    </GuestContext.Provider>
  );
}
