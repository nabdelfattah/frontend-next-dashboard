"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type DropdownGroupContextType = {
  openId: string | null;
  toggle: (id: string) => void;
  close: () => void;
};

const DropdownGroupContext = createContext<DropdownGroupContextType | undefined>(
  undefined
);

export function DropdownGroupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const close = useCallback(() => setOpenId(null), []);

  return (
    <DropdownGroupContext.Provider value={{ openId, toggle, close }}>
      {children}
    </DropdownGroupContext.Provider>
  );
}

// Keeps at most one header popup (user menu, notifications, theme configurator,
// language switcher, ...) open at a time: opening one closes any other.
export function useDropdownGroup(id: string) {
  const ctx = useContext(DropdownGroupContext);
  if (!ctx) {
    throw new Error("useDropdownGroup must be used within a DropdownGroupProvider");
  }
  return {
    isOpen: ctx.openId === id,
    toggle: () => ctx.toggle(id),
    close: ctx.close,
  };
}
