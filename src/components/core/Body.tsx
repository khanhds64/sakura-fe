import classNames from "classnames";
import { HTMLAttributes } from "react";

export interface IBodyProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "b0" | "b1" | "b2" | "b3" | "b4" | "b5";
}

export const Body = ({ variant, className, ...rest }: IBodyProps) => {
  return (
    <div
      className={classNames(
        "leading-normal",
        {
          "text-xl": variant === "b0",
          "text-lg": variant === "b1",
          "text-base": variant === "b2",
          "text-sm": variant === "b3",
          "text-xs": variant === "b4",
        },
        className,
      )}
      {...rest}
    />
  );
};
