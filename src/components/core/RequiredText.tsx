import classNames from "classnames";

import { Body, IBodyProps } from "./Body";

export const RequiredText = (props: IBodyProps) => {
  const { variant = "b2", className, ...rest } = props;
  return (
    <Body
      variant={variant}
      className={classNames("text-red-500 p-0.5 rounded", className)}
      {...rest}
    />
  );
};
