
import Cookies from "universal-cookie";
import { LoginResponse } from "../api";

const AUTH_INFO_COOKIE = "auth_info";
const cookies = new Cookies();
const listeners = new Set<() => void>();

type AuthorizationState = {
    authData: LoginResponse | null;
    initialized: boolean;
};

// Keep the snapshot reference stable between updates.
let snapshot: AuthorizationState = {
    authData: null,
    initialized: false,
};

function readCookie(): LoginResponse | null {
    const data: unknown = cookies.get(AUTH_INFO_COOKIE);

    if (
        typeof data !== "object" ||
        data === null ||
        !("email" in data) ||
        typeof data.email !== "string" ||
        !("role" in data) ||
        typeof data.role !== "string"
    ) {
        return null;
    }

    return {
        email: data.email,
        role: data.role as LoginResponse["role"],
    };
}

function initializeSnapshot(): void {
    if (snapshot.initialized) return;

    snapshot = {
        authData: readCookie(),
        initialized: true,
    };
}

export function getAuthorizationInfo(): AuthorizationState {
    initializeSnapshot();
    return snapshot;
}

function notifyListeners(): void {
    listeners.forEach((listener) => listener());
}

export function subscribeAuthorizationInfo(
    listener: () => void,
): () => void {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

export function saveAuthorizationInfo(data: LoginResponse): void {
    cookies.set(AUTH_INFO_COOKIE, data, {
        path: "/",
        maxAge: 60 * 60 * 24 * 3,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });

    snapshot = {
        authData: {
            email: data.email,
            role: data.role,
        },
        initialized: true,
    };

    notifyListeners();
}

export function clearAuthorizationInfo(): void {
    cookies.remove(AUTH_INFO_COOKIE, { path: "/" });

    snapshot = {
        authData: null,
        initialized: true,
    };

    notifyListeners();
}
