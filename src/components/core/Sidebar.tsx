"use client";

import classNames from "classnames";
import { HTMLAttributes, ReactNode } from "react";
import Link, { LinkProps } from "next/link";

export interface IItemProps extends LinkProps {
  pathName?: string;
  children?: ReactNode;
  className?: string;
}

export const Item = (props: IItemProps) => {
  const { pathName, href, children, className, ...rest } = props;

  const isActive =
    pathName && pathName.startsWith(href.toString()) ? true : false;

  return (
    <Link
      className={classNames(
        "relative flex items-center gap-2 rounded-lg p-3 no-underline",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
        {
          "text-blue-100 hover:bg-blue-900 hover:text-white": !isActive,
          "bg-blue-100 text-blue-950 font-semibold": isActive,
        },
        className,
      )}
      href={href}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    >
      <div className="text-base font-medium whitespace-pre-line">
        {children}
      </div>
    </Link>
  );
};

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  pathName?: string;
  onLogout?: () => void;
}

const Sidebar = (props: SidebarProps) => {
  const { pathName, className, ...rest } = props;

  return (
    <div
      className={classNames(
        "flex flex-col justify-between gap-12",
        "bg-blue-900 px-4 py-6 text-blue-50",
        className,
      )}
      {...rest}
    >
      <div className="flex grow flex-col gap-2 overflow-y-auto">
        <Item pathName={pathName} href="/dashboard">
          Dashboard
        </Item>

        <Item pathName={pathName} href="/management">
          Management
        </Item>
      </div>
    </div>
  );
};

export default Sidebar;
