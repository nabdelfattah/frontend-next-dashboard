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
 * Floating dropdown panel, anchored to a trigger element and rendered in a portal.
 *
 * Positions itself relative to `anchorRef` (flipping/shifting to stay within the viewport)
 * and closes on an outside click. The trigger element must carry the `dropdown-toggle`
 * class so its own click isn't treated as an outside click; toggling `isOpen` is the
 * caller's responsibility (typically from the trigger's `onClick`).
 *
 * @param isOpen - Whether the panel is rendered. Renders nothing when `false`.
 * @param onClose - Called when the user clicks outside the panel.
 * @param anchorRef - Ref to the trigger element the menu is anchored to.
 * @param children - Panel content, typically a list of `DropdownItem`s.
 * @param className - Additional classes merged onto the panel.
 * @param placement - Preferred side/alignment. Defaults to `"bottom-end"`.
 *
 * @example
 * const anchorRef = useRef<HTMLButtonElement>(null);
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <button ref={anchorRef} className="dropdown-toggle" onClick={() => setIsOpen((o) => !o)}>
 *   Open menu
 * </button>
 * <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} anchorRef={anchorRef}>
 *   <DropdownItem onItemClick={() => setIsOpen(false)}>Action</DropdownItem>
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
      if (
        floatingEl &&
        !floatingEl.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".dropdown-toggle")
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
        className={`z-99999 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};
