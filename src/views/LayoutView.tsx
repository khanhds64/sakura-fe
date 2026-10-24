"use client";

import { HTMLAttributes, useEffect } from "react";
import Header from "../components/core/Header";
import classNames from "classnames";

import { useRedirectConfirm } from "../hooks/useRedirectConfirm";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { apiClient } from "../api/config-api";
import { Modal } from "../components/core/Modal";

export interface ILayoutViewProps extends HTMLAttributes<HTMLDivElement> {
  roles?: string[];
}

export default function LayoutView(props: ILayoutViewProps) {
  const { children, roles, className, ...rest } = props;
  const { authData, initialized, setAuthorizationData } = useAuth();
  const { redirectConfirm, cancelRedirect } = useRedirectConfirm();
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSettled: () => {
      // Always clear local auth state, even if the API request fails.
      setAuthorizationData(null);
      router.replace("/login");
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  const onCancelRedirect = () => {
    cancelRedirect();
  };

  const onConfirmRedirect = () => {
    router.push(redirectConfirm.url);
    cancelRedirect();
  };

  // prevent user access by typing url on browser
  useEffect(() => {
    const roleCheck = () => {
      if (!initialized || _.isUndefined(roles)) {
        return;
      }

      if (!authData && _.isArray(roles)) {
        router.replace("/login");
      }

      if (
        authData &&
        _.isArray(roles) &&
        !_.isEmpty(roles) &&
        !roles.includes(authData.role)
      ) {
        router.replace("/");
      }
    };

    roleCheck();
  }, [router, roles, authData, initialized]);

  return (
    <div className={classNames("min-h-screen bg-gray-50", className)} {...rest}>
      {authData && <Header onLogout={logout} />}

      <main className={authData ? "pt-4" : ""}>{children}</main>

      {redirectConfirm.show && (
        <Modal
          title="Unsaved Changes"
          text={
            "The content you entered has not been saved. If you leave this page, your changes will be lost. \n Are you sure you want to continue?"
          }
          onClose={onCancelRedirect}
          onConfirm={onConfirmRedirect}
        />
      )}
    </div>
  );
}
