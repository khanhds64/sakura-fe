import classNames from "classnames";

import { Body, IBodyProps } from "./Body";

export const FieldTitle = (props: IBodyProps) => {
  const { variant = "b2", className, ...rest } = props;
  return (
    <Body
      variant={variant}
      className={classNames("text-ink-500", className)}
      {...rest}
    />
  );
};
