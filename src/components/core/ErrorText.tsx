import classNames from "classnames";
import { Heading, IHeadingProps } from "./Heading";

export const ErrorText = (props: IHeadingProps) => {
  const { variant = "h6", className, ...rest } = props;
  return (
    <Heading
      variant={variant}
      className={classNames("text-red-500", className)}
      {...rest}
    />
  );
};
