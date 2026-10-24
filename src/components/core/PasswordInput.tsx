"use client";

import { HTMLInputTypeAttribute, useState } from "react";
import Input, { IInputProps } from "./Input";
import classNames from "classnames";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = (props: IInputProps) => {
  const { className, type = "password", ...rest } = props;

  const [inputType, setInputType] = useState<
    HTMLInputTypeAttribute | undefined
  >(type);

  const onToggleShowHide = () => {
    if (inputType !== "text" && inputType !== "password") {
      return;
    }
    setInputType(inputType === "text" ? "password" : "text");
  };

  return (
    <div className="relative">
      <Input
        className={classNames("w-full pr-8", className)}
        type={inputType}
        {...rest}
      />
      {inputType === "password" && (
        <Eye
          className={"absolute cursor-pointer top-3 right-3"}
          size={24}
          onClick={onToggleShowHide}
        />
      )}

      {inputType === "text" && (
        <EyeOff
          className={"absolute cursor-pointer top-3 right-3"}
          size={24}
          onClick={onToggleShowHide}
        />
      )}
    </div>
  );
};

export default PasswordInput;
