"use client";
import { useId } from "react";
import { useDropdownCoordinatorStore } from "../stores/dropdown-store";

/**
 * Open/close state for a single dropdown, coordinated app-wide: opening one
 * dropdown via this hook closes any other dropdown that also uses it, so at
 * most one is ever open at a time — regardless of where each lives in the tree.
 *
 * @example
 * const { isOpen, toggle, close } = useDropdownToggle();
 * <button className="dropdown-toggle" onClick={toggle}>Open</button>
 * <Dropdown isOpen={isOpen} onClose={close} anchorRef={anchorRef}>...</Dropdown>
 */
export default function useDropdownToggle() {
  const id = useId();
  const isOpen = useDropdownCoordinatorStore((state) => state.openId === id);
  const openAction = useDropdownCoordinatorStore((state) => state.open);
  const closeAction = useDropdownCoordinatorStore((state) => state.close);
  const toggleAction = useDropdownCoordinatorStore((state) => state.toggle);

  return {
    isOpen,
    open: () => openAction(id),
    close: () => closeAction(id),
    toggle: () => toggleAction(id),
  };
}
