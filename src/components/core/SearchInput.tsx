"use client";

import { InputHTMLAttributes } from "react";
import Input from "./Input";
import classNames from "classnames";
import SearchIcon from "../icons/SearchIcon";

const SearchInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const { className, ...rest } = props;
  return (
    <div className="relative">
      <Input className={classNames("w-full pr-10", className)} {...rest} />
      <SearchIcon
        className={"text-black absolute top-3 right-3"}
        width={24}
        height={24}
      />
    </div>
  );
};

export default SearchInput;
