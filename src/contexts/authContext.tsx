"use client";

import {
  createContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  getAuthorizationInfo,
  saveAuthorizationInfo,
  clearAuthorizationInfo,
  subscribeAuthorizationInfo,
} from "../lib/authCookies";
import { LoginResponse } from "../api";

type AuthorizationState = {
  authData: LoginResponse | null;
  initialized: boolean;
};

type AuthContextType = AuthorizationState & {
  setAuthorizationData: (data: LoginResponse | null) => void;
};

const SERVER_SNAPSHOT: AuthorizationState = {
  authData: null,
  initialized: false,
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authorization = useSyncExternalStore(
    subscribeAuthorizationInfo,
    getAuthorizationInfo,
    () => SERVER_SNAPSHOT,
  );

  const setAuthorizationData = useCallback((data: LoginResponse | null) => {
    if (data) {
      saveAuthorizationInfo(data);
    } else {
      clearAuthorizationInfo();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authorization,
        setAuthorizationData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
