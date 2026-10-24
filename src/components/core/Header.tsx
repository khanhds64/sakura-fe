"use client";

import { useCallback, useRef, useState } from "react";
import { UserRound, LogOut } from "lucide-react";
import Button from "./Button";
import { Body } from "./Body";
import { useClickoutside } from "@/src/hooks/useClickoutside";
import Link from "next/link";
import classNames from "classnames";
import { LayoutDashboard, ClipboardList } from "lucide-react";
import { usePathname } from "next/navigation";
import { USER_ROLE } from "@/src/lib/constants";
import { useAuth } from "@/src/hooks/useAuth";

interface HeaderProps {
  onLogout?: () => void;
}

const Header = ({ onLogout }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { authData } = useAuth();
  const pathname = usePathname();
  const isAdmin = authData?.role === USER_ROLE.admin;

  const handleClickOutside = useCallback(() => {
    setOpen(false);
  }, []);

  useClickoutside(ref, handleClickOutside);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-blue-100 bg-white px-6 shadow-sm">
      <nav className="flex items-center gap-1">
        <Link
          href="/"
          className={classNames(
            "inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            pathname.startsWith("/")
              ? "bg-blue-50 text-blue-700"
              : "text-zinc-800 hover:bg-blue-50 hover:text-blue-700",
          )}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {isAdmin && (
          <Link
            href="/management"
            className={classNames(
              "inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              pathname.startsWith("/management")
                ? "bg-blue-50 text-blue-700"
                : "text-zinc-800 hover:bg-blue-50 hover:text-blue-700",
            )}
          >
            <ClipboardList size={18} />
            Management
          </Link>
        )}
      </nav>

      <div ref={ref} className="relative">
        <Button
          className="rounded-lg"
          variant="ghost"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-blue-800">
            <UserRound size={18} />
          </span>
        </Button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-blue-100 bg-white py-1 shadow-lg">
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="hover:bg-blue-50 hover:text-blue-700"
            >
              <LogOut size={18} />
              <Body className="whitespace-nowrap" variant="b3">
                Log out
              </Body>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
