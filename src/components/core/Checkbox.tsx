"use client";

import { InputHTMLAttributes } from "react";
import { Square, SquareCheck } from "lucide-react";
import classNames from "classnames";

export interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = (props: ICheckboxProps) => {
  const { label, className, children, ...rest } = props;

  return (
    <label className="flex items-center gap-0.5 cursor-pointer">
      <input
        type="checkbox"
        className={classNames("peer sr-only", className)}
        {...rest}
      />

      <SquareCheck
        size={25}
        aria-hidden="true"
        className="hidden shrink-0 text-zinc-800 peer-checked:block"
      />

      <Square
        size={25}
        aria-hidden="true"
        className="shrink-0 text-zinc-800 peer-checked:hidden"
      />

      {label && (
        <span className="text-base leading-normal text-gray-900">{label}</span>
      )}

      {children}
    </label>
  );
};

Checkbox.displayName = "Checkbox";
