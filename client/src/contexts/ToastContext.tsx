import React, { createContext, useContext, useReducer, useCallback } from "react";

export type ToastVariant = "success" | "info" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
  duration?: number;
}

type ToastState = {
  toasts: ToastItem[];
};

type ToastAction =
  | { type: "PUSH_TOAST"; payload: ToastItem }
  | { type: "REMOVE_TOAST"; payload: string };

const initialState: ToastState = {
  toasts: [],
};

function genId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "PUSH_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

interface ToastContextValue {
  push: (toast: Omit<ToastItem, "id">) => string;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const push = useCallback(
    (toast: Omit<ToastItem, "id">): string => {
      const id = genId();
      const fullToast: ToastItem = { id, ...toast };
      dispatch({ type: "PUSH_TOAST", payload: fullToast });
      return id;
    },
    []
  );

  const remove = useCallback((id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  }, []);

  const value: ToastContextValue & { toasts: ToastItem[] } = {
    toasts: state.toasts,
    push,
    remove,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx as ToastContextValue & { toasts: ToastItem[] };
}
