"use client";

import classNames from "classnames";
import _ from "lodash";
import { InputHTMLAttributes } from "react";

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = (props: IInputProps) => {
  const { error, className, disabled, ...rest } = props;
  return (
    <input
      className={classNames(
        "w-full max-h-11 rounded border p-3 text-base transition-colors",
        "bg-white text-zinc-800 placeholder:text-zinc-400 border-zinc-300",
        "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-200",
        {
          "border-blue-500 focus:outline-blue-500": _.isEmpty(error),
          "border-red-500 focus:outline-red-500":
            !_.isEmpty(error) && !disabled,
        },
        className,
      )}
      disabled={disabled}
      {...rest}
    />
  );
};

export default Input;
