import { useContext } from "react";
import { RedirectConfirmContext } from "../contexts/redirectConfirmContext";

export function useRedirectConfirm() {
    const context = useContext(RedirectConfirmContext);

    if (!context) {
        throw new Error(
            "useRedirectConfirm must be used within RedirectConfirmProvider",
        );
    }

    return context;
}