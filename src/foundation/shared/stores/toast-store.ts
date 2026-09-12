import { create } from "zustand";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title: string;
  message: string;
}

interface ToastStore {
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (toast: Omit<ToastMessage, "id">) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  showToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
}));

/**
 * Displays a toast notification. Callable from anywhere — event handlers, API
 * response callbacks, etc. — not just from within a React component.
 *
 * @example
 * showToast({ variant: "success", title: "Saved", message: "Changes saved successfully." });
 */
export const showToast = useToastStore.getState().showToast;
