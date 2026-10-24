"use client"

import { useEffect, useEffectEvent, type RefObject } from "react";

// e.target → the element that actually triggered the event.
// e.currentTarget → the element where the event listener is attached.

export function useClickoutside(
    element: RefObject<Element | null>,
    callback: () => void,
) {
    const callbackEvent = useEffectEvent(callback);

    useEffect(() => {
        const handleClick = (e: PointerEvent) => {
            const target = e.target;

            if (
                element.current &&
                target instanceof Node &&
                !element.current.contains(target)
            ) {
                callbackEvent();
            }
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [element]);
}
