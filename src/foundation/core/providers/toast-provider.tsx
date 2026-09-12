"use client";

import { Toast } from "radix-ui";
import Alert from "@shared/components/alert";
import { useDirection } from "./direction-provider";
import { useToastStore } from "@shared/stores/toast-store";

/**
 * Mounts the toast notification viewport and renders any active toasts (pushed via
 * `showToast` from `@shared/stores/toast-store`) using the shared `Alert` component for
 * their visuals. Each toast auto-dismisses after 3 seconds. Mount this once near the
 * root of the app.
 *
 * Positioned at the top end of the viewport — top-right for `ltr`, top-left for
 * `rtl` — following the ambient direction from `DirectionProvider`.
 *
 * @param children - App content, rendered alongside the toast viewport.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);
  const dir = useDirection();

  return (
    <Toast.Provider duration={3000} swipeDirection={dir === "rtl" ? "left" : "right"}>
      {children}

      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          onOpenChange={(open) => {
            if (!open) dismissToast(toast.id);
          }}
          className="pointer-events-auto data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[swipe=end]:animate-out data-[swipe=end]:fade-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]"
        >
          <Alert variant={toast.variant} title={toast.title} message={toast.message} />
          <Toast.Title className="sr-only">{toast.title}</Toast.Title>
          <Toast.Description className="sr-only">{toast.message}</Toast.Description>
        </Toast.Root>
      ))}

      <Toast.Viewport className="fixed top-4 end-4 z-99999 flex w-full max-w-sm flex-col gap-2 outline-none" />
    </Toast.Provider>
  );
}
