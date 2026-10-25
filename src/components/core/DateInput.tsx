"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import classNames from "classnames";
import { InputHTMLAttributes, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import Input from "./Input";
import Button from "./Button";
import { formatDateToString } from "@/src/lib/format";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DateTime } from "luxon";

export interface IDateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  onSelectDate?: (d: string) => void;
}

const DateInput = (props: IDateInputProps) => {
  const { error, onSelectDate, className, value, ...rest } = props;
  const ref = useRef<HTMLButtonElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(
    value && typeof value === "string" ? new Date(value) : new Date(),
  );

  const onConfirmSelectDate = () => {
    if (onSelectDate) {
      onSelectDate(formatDateToString(selectedDate));
    }
    ref.current?.click();
  };

  const onClearDate = () => {
    if (onSelectDate) {
      onSelectDate("");
    }
    ref.current?.click();
  };

  return (
    <Popover>
      <PopoverTrigger ref={ref}>
        <Input
          type="text"
          className={classNames(
            "bg-[url('/calendarIcon.svg')] bg-no-repeat bg-position-[right_12px_center] bg-size-[18px_18px] pr-11",
            className,
          )}
          value={value}
          error={error}
          {...rest}
          readOnly
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="z-50 w-76 rounded-2xl border border-gray-200 bg-white p-0 shadow-lg shadow-blue-100/50"
      >
        <div className="relative p-4 text-gray-800">
          <DayPicker
            mode="single"
            showOutsideDays
            selected={selectedDate}
            month={selectedDate}
            disabled={{ after: new Date() }}
            onSelect={(d) => {
              if (d) setSelectedDate(d);
            }}
            className="w-full"
            classNames={{
              months: "w-full",
              month: "w-full",
              month_caption: "flex h-9 items-center justify-center pb-2",
              caption_label: "text-sm font-semibold text-gray-800",
              nav: "absolute right-0 top-4 z-10 flex w-full items-center justify-between px-3",
              button_previous:
                "inline-flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700",
              button_next:
                "inline-flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700",
              month_grid: "w-full border-collapse",
              weekdays: "flex justify-between border-b border-gray-100 pb-2",
              weekday:
                "flex h-9 w-9 items-center justify-center text-xs font-medium text-gray-500",
              week: "mt-1 flex justify-between",
              day: "flex h-9 w-9 items-center justify-center",
              day_button:
                "flex size-9 items-center justify-center rounded-lg text-sm hover:bg-blue-50 hover:text-blue-700",
              today: "font-semibold text-blue-700",
              selected: "rounded-lg bg-blue-600 text-white",
              outside: "text-gray-300",
              disabled: "cursor-not-allowed text-gray-300 opacity-50",
            }}
            components={{
              PreviousMonthButton: (props) => (
                <button
                  {...props}
                  type="button"
                  aria-label="Previous month"
                  className="inline-flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => {
                    const d = DateTime.fromJSDate(selectedDate);
                    setSelectedDate(d.minus({ months: 1 }).toJSDate());
                  }}
                >
                  <ArrowLeft size={18} />
                </button>
              ),
              NextMonthButton: (props) => (
                <button
                  {...props}
                  type="button"
                  aria-label="Next month"
                  className="inline-flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => {
                    const d = DateTime.fromJSDate(selectedDate);
                    setSelectedDate(d.plus({ months: 1 }).toJSDate());
                  }}
                >
                  <ArrowRight size={18} />
                </button>
              ),
            }}
          />

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
            <Button
              variant="secondary"
              type="button"
              className="w-full"
              onClick={onClearDate}
            >
              Clear
            </Button>
            <Button
              type="button"
              className="w-full"
              onClick={onConfirmSelectDate}
            >
              Select
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateInput;
