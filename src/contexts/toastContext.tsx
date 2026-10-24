"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Body } from "../components/core/Body";
import Button from "../components/core/Button";

type ToastType = "success" | "error";

type Toast = {
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  hideToast: () => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => setToast(null), 3000);

    return () => clearTimeout(timeout);
  }, [toast]);

  const showSuccess = (message: string) => {
    setToast({ message, type: "success" });
  };

  const showError = (message: string) => {
    setToast({ message, type: "error" });
  };

  const hideToast = () => setToast(null);

  return (
    <ToastContext value={{ showSuccess, showError, hideToast }}>
      {children}

      {toast && (
        <div
          role="alert"
          className={`z-200 fixed top-25 left-1/2 -translate-x-1/2 w-max max-w-[90vw] flex items-center gap-2 py-2 px-4 rounded-lg text-zinc-800 ${
            toast.type === "success"
              ? "bg-blue-300 border-blue-300"
              : "bg-red-300 border-red-300"
          }`}
        >
          <div className="flex items-center gap-4">
            <Body>{toast.message}</Body>
            <Button
              variant="ghost"
              onClick={hideToast}
              aria-label="Close notification"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </ToastContext>
  );
}
