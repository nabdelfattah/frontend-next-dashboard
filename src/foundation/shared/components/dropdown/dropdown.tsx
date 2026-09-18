"use client";
import type React from "react";
import { useEffect } from "react";
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  /** Ref to the trigger element the menu is anchored to. */
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  /** Preferred side/alignment; flips/shifts automatically to stay in the viewport. */
  placement?: Placement;
}

/**
 * Floating dropdown panel, anchored to a trigger element and rendered in a
 * portal so it's never clipped by an `overflow: hidden` ancestor.
 *
 * Positions itself relative to `anchorRef`, flipping/shifting to stay inside
 * the viewport and capping its size to the available space. Closes on an
 * outside click. The trigger must carry the `dropdown-toggle` class, otherwise
 * clicking it counts as "outside" and immediately closes what it just opened.
 * Toggling `isOpen` is the caller's job — usually via `useDropdownToggle`,
 * which also ensures only one dropdown is open at a time app-wide.
 *
 * @param isOpen - Whether the panel is rendered. Renders nothing when `false`.
 * @param onClose - Called when the user clicks outside the panel.
 * @param anchorRef - Ref to the trigger element the panel is positioned against.
 * @param children - Panel content, typically a list of `DropdownItem`s.
 * @param className - Additional classes merged onto the panel.
 * @param placement - Preferred side/alignment. Defaults to `"bottom-end"`.
 *
 * @example
 * const { isOpen, toggle, close } = useDropdownToggle();
 * const anchorRef = useRef<HTMLButtonElement>(null);
 *
 * <button ref={anchorRef} className="dropdown-toggle" onClick={toggle}>
 *   Open menu
 * </button>
 * <Dropdown isOpen={isOpen} onClose={close} anchorRef={anchorRef}>
 *   <DropdownItem onItemClick={close}>Action</DropdownItem>
 * </Dropdown>
 */
export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  anchorRef,
  children,
  className = "",
  placement = "bottom-end",
}) => {
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
    ],
  });

  useEffect(() => {
    refs.setReference(anchorRef.current);
  }, [anchorRef, refs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const floatingEl = refs.floating.current;
      const target = event.target as HTMLElement;
      if (
        floatingEl &&
        !floatingEl.contains(event.target as Node) &&
        !target.closest(".dropdown-toggle") &&
        // A non-static flatpickr calendar renders on `document.body`, outside
        // this panel's DOM subtree — don't treat clicking it as "outside".
        !target.closest(".flatpickr-calendar")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // `refs` is a stable object identity from useFloating; only `onClose` can change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <div
        // eslint-disable-next-line react-hooks/refs -- documented floating-ui callback-ref API
        ref={refs.setFloating}
        style={floatingStyles}
        className={`z-99999 overflow-y-auto rounded-xl border border-border bg-popover shadow-theme-lg ${className}`}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};
