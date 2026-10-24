"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import queryString from "query-string";
import { useRedirectConfirm } from "@/src/hooks/useRedirectConfirm";
import { getApiErrorMessage } from "@/src/lib/getApiErrorMessage";
import { DailyMetricRequest } from "@/src/api";
import { Heading } from "@/src/components/core/Heading";
import Input from "@/src/components/core/Input";
import { ErrorText } from "@/src/components/core/ErrorText";
import Button from "@/src/components/core/Button";
import { FieldTitle } from "@/src/components/core/FieldTitle";
import { RequiredText } from "@/src/components/core/RequiredText";
import { useToast } from "@/src/hooks/useToast";
import DateInput from "@/src/components/core/DateInput";
import { apiClient } from "@/src/api/config-api";
import {
  commaStringToNumber,
  formatNumberComma,
  formatStringToStringComma,
} from "@/src/lib/format";
import { ArrowLeft } from "lucide-react";

const schema = Yup.object().shape({
  metricDate: Yup.string().required("Metric date is required"),
  posRevenue: Yup.string()
    .test("validate-is-number", "Enter valid number", (value) => {
      if (!value) return true;
      return _.isFinite(commaStringToNumber(value));
    })
    .test(
      "validate-number",
      "Enter a positive number greater than or equal to 1",
      (value) => {
        if (!value) return true;
        const valueAsNumber = commaStringToNumber(value);
        if (!_.isFinite(valueAsNumber)) return true;
        return _.toNumber(valueAsNumber) > 0;
      },
    )
    .required("POS revenue is required"),
  eatclubRevenue: Yup.string()
    .test("validate-is-number", "Enter valid number", (value) => {
      if (!value) return true;
      return _.isFinite(commaStringToNumber(value));
    })
    .test(
      "validate-number",
      "Enter a positive number greater than or equal to 1",
      (value) => {
        if (!value) return true;
        const valueAsNumber = commaStringToNumber(value);
        if (!_.isFinite(valueAsNumber)) return true;
        return _.toNumber(valueAsNumber) > 0;
      },
    )
    .required("Eatclub revenue is required"),
  labourCosts: Yup.string()
    .test("validate-is-number", "Enter valid number", (value) => {
      if (!value) return true;
      return _.isFinite(commaStringToNumber(value));
    })
    .test(
      "validate-number",
      "Enter a positive number greater than or equal to 1",
      (value) => {
        if (!value) return true;
        const valueAsNumber = commaStringToNumber(value);
        if (!_.isFinite(valueAsNumber)) return true;
        return _.toNumber(valueAsNumber) > 0;
      },
    )
    .required("Labour cost is required"),
  covers: Yup.string()
    .test("validate-is-number", "Enter valid number", (value) => {
      if (!value) return true;
      return _.isFinite(commaStringToNumber(value));
    })
    .test(
      "validate-number",
      "Enter a positive number greater than or equal to 1",
      (value) => {
        if (!value) return true;
        const valueAsNumber = commaStringToNumber(value);
        if (!_.isFinite(valueAsNumber)) return true;
        return _.toNumber(valueAsNumber) > 0;
      },
    )
    .required("Covers is required"),
});

type TDailyMetric = Yup.InferType<typeof schema>;

const DailyMetricForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const id = searchParams.get("id") || "";
  const metricsPageUrl = queryString.exclude(
    `/management${searchParamStr ? "?" + searchParamStr : ""}`,
    ["id", "formInstance"],
  );

  const { showError, showSuccess } = useToast();

  const {
    register,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    resolver: yupResolver(schema),
    defaultValues: {
      metricDate: "",
      posRevenue: "",
      eatclubRevenue: "",
      labourCosts: "",
      covers: "",
    },
  });
  const watcher = watch();
  const { showRedirectConfirm } = useRedirectConfirm();

  const catchApiError = (error: Error | null) => {
    showError(getApiErrorMessage(error));
    return null;
  };

  useQuery({
    queryKey: ["dailyMetricDetail", id],
    queryFn: () =>
      apiClient
        .getAdminDailyMetricById(id)
        .then((res) => {
          const { data } = res;
          reset({
            metricDate: data.metricDate || "",
            posRevenue: formatNumberComma(data.posRevenue),
            eatclubRevenue: formatNumberComma(data.eatclubRevenue),
            labourCosts: formatNumberComma(data.labourCosts),
            covers: formatNumberComma(data.covers),
          });
          return data;
        })
        .catch(catchApiError),
    retry: false,
    enabled: !_.isEmpty(id),
    refetchOnWindowFocus: false,
  });

  const createDailyMetricMutation = useMutation({
    mutationFn: (req: DailyMetricRequest) =>
      apiClient.createAdminDailyMetric(req),
    onSuccess: () => {
      showSuccess("Save successfully");
      router.push(metricsPageUrl);
    },
    onError: (error) => showError(getApiErrorMessage(error)),
  });

  const editDailyMetricMutation = useMutation({
    mutationFn: (req: DailyMetricRequest) =>
      apiClient.updateAdminDailyMetric(id, req),
    onSuccess: () => {
      showSuccess("Save successfully");
      router.push(metricsPageUrl);
    },
    onError: (error) => showError(getApiErrorMessage(error)),
  });

  const buildDailymetricRequest = (data: TDailyMetric): DailyMetricRequest => {
    return {
      metricDate: data.metricDate,
      posRevenue: commaStringToNumber(data.posRevenue) || 0,
      eatclubRevenue: commaStringToNumber(data.eatclubRevenue) || 0,
      labourCosts: commaStringToNumber(data.labourCosts) || 0,
      covers: commaStringToNumber(data.covers) || 0,
    };
  };

  const onCancel = () => {
    if (isDirty) {
      showRedirectConfirm(metricsPageUrl);
      return;
    }
    router.push(metricsPageUrl);
  };

  const onSubmit = handleSubmit((data) => {
    const req = buildDailymetricRequest(data);

    if (!id) {
      createDailyMetricMutation.mutate(req);
      return;
    }

    editDailyMetricMutation.mutate(req);
  });

  return (
    <div
      className={"mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"}
    >
      <Button
        variant="secondary"
        className="absolute top-18 left-10"
        onClick={() => router.push(metricsPageUrl)}
      >
        <ArrowLeft size={20} />
        <Heading variant="h2">Back</Heading>
      </Button>
      <Heading variant="h1">{id ? "Data Edit" : "Data Create"}</Heading>

      <div
        className={
          "grid grid-cols-[210px_auto] max-w-259 gap-4 max-sm:grid-cols-1 max-sm:gap-2"
        }
      >
        <div className={"py-2.5 max-sm:py-0"}>
          <div className={"flex items-center gap-2"}>
            <FieldTitle>Metric Date</FieldTitle>
            <RequiredText>(Required)</RequiredText>
          </div>
        </div>
        <div className={"flex flex-col gap-1"}>
          <div className={"grid grid-cols-1 "}>
            <DateInput
              placeholder={"Enter date"}
              className={"w-full"}
              value={watcher.metricDate}
              error={errors.metricDate ? errors.metricDate.message : ""}
              onSelectDate={(d) =>
                setValue("metricDate", d, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </div>
          {errors.metricDate && (
            <ErrorText className={"pl-3"}>
              {errors.metricDate.message}
            </ErrorText>
          )}
        </div>

        <div className={"py-2.5 max-sm:py-0"}>
          <div className={"flex items-center gap-2"}>
            <FieldTitle>POS Revenue</FieldTitle>
            <RequiredText>(Required)</RequiredText>
          </div>
        </div>
        <div className={"flex flex-col gap-1"}>
          <Input
            placeholder={"POS Revenue"}
            error={errors.posRevenue ? errors.posRevenue.message : ""}
            {...register("posRevenue")}
            onBlur={(e) =>
              setValue("posRevenue", formatStringToStringComma(e.target.value))
            }
          />
          {errors.posRevenue && (
            <ErrorText className="pl-3">{errors.posRevenue.message}</ErrorText>
          )}
        </div>

        <div className={"py-2.5 max-sm:py-0"}>
          <div className={"flex items-center gap-2"}>
            <FieldTitle>Eatclub Revenue</FieldTitle>
            <RequiredText>(Required)</RequiredText>
          </div>
        </div>
        <div className={"flex flex-col gap-1"}>
          <Input
            placeholder={"Eatclub Revenue"}
            error={errors.eatclubRevenue ? errors.eatclubRevenue.message : ""}
            {...register("eatclubRevenue")}
            onBlur={(e) =>
              setValue(
                "eatclubRevenue",
                formatStringToStringComma(e.target.value),
              )
            }
          />
          {errors.eatclubRevenue && (
            <ErrorText className="pl-3">
              {errors.eatclubRevenue.message}
            </ErrorText>
          )}
        </div>

        <div className={"py-2.5 max-sm:py-0"}>
          <div className={"flex items-center gap-2"}>
            <FieldTitle>Labour Costs</FieldTitle>
            <RequiredText>(Required)</RequiredText>
          </div>
        </div>
        <div className={"flex flex-col gap-1"}>
          <Input
            placeholder={"Labour Costs"}
            error={errors.labourCosts ? errors.labourCosts.message : ""}
            {...register("labourCosts")}
            onBlur={(e) =>
              setValue("labourCosts", formatStringToStringComma(e.target.value))
            }
          />
          {errors.labourCosts && (
            <ErrorText className="pl-3">{errors.labourCosts.message}</ErrorText>
          )}
        </div>

        <div className={"py-2.5 max-sm:py-0"}>
          <div className={"flex items-center gap-2"}>
            <FieldTitle>Covers</FieldTitle>
            <RequiredText>(Required)</RequiredText>
          </div>
        </div>
        <div className={"flex flex-col gap-1"}>
          <Input
            placeholder={"Covers"}
            error={errors.covers ? errors.covers.message : ""}
            {...register("covers")}
            onBlur={(e) =>
              setValue("covers", formatStringToStringComma(e.target.value))
            }
          />
          {errors.covers && (
            <ErrorText className="pl-3">{errors.covers.message}</ErrorText>
          )}
        </div>
      </div>

      <hr className="border-gray-400" />

      <div className="grid grid-cols-2 gap-4 px-25">
        <Button
          variant="secondary"
          disabled={
            createDailyMetricMutation.isPending ||
            editDailyMetricMutation.isPending
          }
          onClick={onCancel}
        >
          <Heading variant="h2">Cancel</Heading>
        </Button>
        <Button
          onClick={onSubmit}
          disabled={
            createDailyMetricMutation.isPending ||
            editDailyMetricMutation.isPending ||
            !isDirty
          }
        >
          <Heading variant="h2">Save</Heading>
        </Button>
      </div>
    </div>
  );
};

export default DailyMetricForm;
