"use client";

import classNames from "classnames";
import { HTMLAttributes, MouseEventHandler } from "react";
import { Heading } from "./Heading";
import { Body } from "./Body";
import Button from "./Button";
import { X } from "lucide-react";

export interface IModalProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  text?: string;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
  isPending?: boolean;
  onClose?: () => void;
}

export const Modal = (props: IModalProps) => {
  const {
    title,
    text,
    onConfirm,
    isPending = false,
    className,
    onClose,
    ...rest
  } = props;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-zinc-800/50 p-4">
      <div
        className={classNames(
          "relative flex w-md max-w-full flex-col gap-5 rounded-xl bg-white p-4 shadow-sm",
          className,
        )}
        {...rest}
      >
        <X
          className="absolute right-4 top-4 cursor-pointer text-zinc-800"
          size={24}
          onClick={onClose}
        />

        <div className="flex flex-col gap-4">
          <Heading className="pr-6 text-zinc-800" variant="h2">
            {title}
          </Heading>

          <Body className="whitespace-pre-line text-ink-400" variant="b2">
            {text}
          </Body>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" disabled={isPending} onClick={onClose}>
            <Heading variant="h2">Cancel</Heading>
          </Button>

          <Button disabled={isPending} onClick={onConfirm}>
            <Heading variant="h2">Confirm</Heading>
          </Button>
        </div>
      </div>
    </div>
  );
};
