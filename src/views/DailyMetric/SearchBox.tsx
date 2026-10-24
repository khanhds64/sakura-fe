"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import * as Yup from "yup";
import { DateTime } from "luxon";
import { DATE_FORMAT_YYYYMMDD } from "@/src/lib/constants";
import DateInput from "@/src/components/core/DateInput";
import { ErrorText } from "@/src/components/core/ErrorText";
import Button from "@/src/components/core/Button";
import { Heading } from "@/src/components/core/Heading";
import { Search } from "lucide-react";

const schema = Yup.object().shape({
  startDate: Yup.string().test(
    "is-before-end-date",
    "start date must be before end date",
    (value, context) => {
      if (!value || _.isEmpty(value) || _.isEmpty(context.parent.endDate)) {
        return true;
      }

      const startDate = DateTime.fromFormat(value, DATE_FORMAT_YYYYMMDD);
      const endDate = DateTime.fromFormat(
        context.parent.endDate,
        DATE_FORMAT_YYYYMMDD,
      );

      if (!startDate.isValid || !endDate.isValid) {
        return true;
      }

      return endDate.diff(startDate, "days").days >= 0;
    },
  ),
  endDate: Yup.string().test(
    "is-after-start-date",
    "start date must be before end date",
    (value, context) => {
      if (!value || _.isEmpty(value) || _.isEmpty(context.parent.startDate)) {
        return true;
      }

      const startDate = DateTime.fromFormat(
        context.parent.startDate,
        DATE_FORMAT_YYYYMMDD,
      );
      const endDate = DateTime.fromFormat(value, DATE_FORMAT_YYYYMMDD);

      if (!startDate.isValid || !endDate.isValid) {
        return true;
      }

      return endDate.diff(startDate, "days").days >= 0;
    },
  ),
});

export type TDailyMetricFilter = Yup.InferType<typeof schema>;

export type ISearchBoxProps = {
  initialValues?: TDailyMetricFilter;
  onSearch?: (data: TDailyMetricFilter) => void;
};

export const SearchBox = ({ initialValues, onSearch }: ISearchBoxProps) => {
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<TDailyMetricFilter>({
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: initialValues?.startDate ?? "",
      endDate: initialValues?.endDate ?? "",
    },
  });

  const watcher = watch();

  const onSubmit = handleSubmit((data) => {
    onSearch?.(data);
  });

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
      <div className="grid min-w-0 grid-rows-[auto_1fr] gap-1">
        <DateInput
          placeholder="Start date"
          className="w-full"
          value={watcher.startDate ?? ""}
          error={errors.startDate?.message}
          onSelectDate={(date) =>
            setValue("startDate", date, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
        {errors.startDate && <ErrorText>{errors.startDate.message}</ErrorText>}
      </div>

      <div className="grid min-w-0 grid-rows-[auto_1fr] gap-1">
        <DateInput
          placeholder="End date"
          className="w-full"
          value={watcher.endDate ?? ""}
          error={errors.endDate?.message}
          onSelectDate={(date) =>
            setValue("endDate", date, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
        {errors.endDate && <ErrorText>{errors.endDate.message}</ErrorText>}
      </div>

      <Button onClick={onSubmit} className="self-start h-11">
        <Search size={18} />
      </Button>
    </div>
  );
};
