import classNames from "classnames";
import { HTMLAttributes } from "react";

export interface IHeadingProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "h0" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = (props: IHeadingProps) => {
  const { variant, className, ...rest } = props;
  return (
    <div
      className={classNames(
        "font-bold leading-normal",
        {
          "text-3xl": variant === "h0",
          "text-2xl": variant === "h1",
          "text-xl": variant === "h2",
          "text-lg": variant === "h3",
          "text-base": variant === "h4",
          "text-sm": variant === "h5",
          "text-xs": variant === "h6",
        },
        className,
      )}
      {...rest}
    />
  );
};
