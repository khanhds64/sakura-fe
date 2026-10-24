"use client";

import classNames from "classnames";
import type { ButtonHTMLAttributes, Ref } from "react";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "active";
  ref?: Ref<HTMLButtonElement>;
}

const Button = ({
  disabled,
  className,
  ref,
  variant = "primary",
  type = "button",
  ...rest
}: IButtonProps) => {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
        {
          "border rounded-xl px-4 py-1.5": variant !== "ghost",

          "border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700 active:border-blue-800 active:bg-blue-800":
            variant === "primary" && !disabled,

          "border-blue-200 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100":
            variant === "secondary" && !disabled,

          "border-yellow-500 bg-yellow-500 text-zinc-800 hover:border-yellow-600 hover:bg-yellow-600 active:border-yellow-700 active:bg-yellow-700":
            variant === "active" && !disabled,

          "p-2 hover:bg-blue-50": variant === "ghost" && !disabled,

          "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 shadow-none":
            disabled,
        },
        className,
      )}
      {...rest}
    />
  );
};

export default Button;
