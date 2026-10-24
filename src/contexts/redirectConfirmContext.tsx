"use client";

import { createContext, useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface IRedirectConfirm {
  show: boolean;
  url: string;
}

interface RedirectConfirmContextType {
  redirectConfirm: IRedirectConfirm;
  showRedirectConfirm: (url: string) => void;
  confirmRedirect: () => void;
  cancelRedirect: () => void;
}

const redirectConfirmInitialState: IRedirectConfirm = {
  show: false,
  url: "#",
};

export const RedirectConfirmContext = createContext<
  RedirectConfirmContextType | undefined
>(undefined);

export function RedirectConfirmProvider({ children }: { children: ReactNode }) {
  const [redirectConfirm, setRedirectConfirm] = useState<IRedirectConfirm>(
    redirectConfirmInitialState,
  );

  const router = useRouter();

  const showRedirectConfirm = useCallback((url: string) => {
    setRedirectConfirm({
      show: true,
      url,
    });
  }, []);

  const confirmRedirect = useCallback(() => {
    if (!redirectConfirm.show || redirectConfirm.url === "#") {
      return;
    }

    const url = redirectConfirm.url;

    setRedirectConfirm(redirectConfirmInitialState);
    router.push(url);
  }, [redirectConfirm, router]);

  const cancelRedirect = useCallback(() => {
    setRedirectConfirm(redirectConfirmInitialState);
  }, []);

  return (
    <RedirectConfirmContext.Provider
      value={{
        redirectConfirm,
        showRedirectConfirm,
        confirmRedirect,
        cancelRedirect,
      }}
    >
      {children}
    </RedirectConfirmContext.Provider>
  );
}
